import { Request, Response } from "express";
import httpStatus from "http-status";
import { User, OTP } from "../models";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "RitickSecret";

export const GenerateOTP = async (req: Request, res: Response) => {
  try {
    // 1. Extract phone number and type ("signup" or "login") from request body
    const { phone, type } = req.body;

    // 2. Validate input format
    if (!phone || !type) {
      res.status(httpStatus.BAD_REQUEST).json({
        data: {},
        success: false,
        message: "Phone number and type are required.",
        error: "Missing phone or type in request body.",
      });
      return;
    }

    if (type !== "login" && type !== "signup") {
      res.status(httpStatus.BAD_REQUEST).json({
        data: {},
        success: false,
        message: "Invalid type provided.",
        error: "Type must be either 'login' or 'signup'.",
      });
      return;
    }

    if (!/^\+91[6-9]\d{9}$/.test(phone)) {
      res.status(httpStatus.BAD_REQUEST).json({
        data: {},
        success: false,
        message: "Invalid phone number format.",
        error: "Phone must be a valid Indian number starting with +91.",
      });
      return;
    }

    const user = await User.findOne({ phone });

    // 3. If type is "login", ensure the phone number exists; if not, respond asking to sign up
    if (type === "login" && !user) {
      res.status(httpStatus.NOT_FOUND).json({
        data: {},
        success: false,
        message: "User not found. Please sign up.",
        error: "No user associated with this phone.",
      });
      return;
    }
    // 4. If type is "signup", ensure the number does not already exist; if it does, respond asking to log in
    if (type === "signup" && user) {
      res.status(httpStatus.CONFLICT).json({
        data: {},
        success: false,
        message: "User already exists. Please log in.",
        error: "Phone already registered.",
      });
      return;
    }

    // 5. Generate a unique OTP (regenerate if a duplicate exists in DB)
    let generatedOTP: number;
    let isUnique = false;

    do {
      generatedOTP = Math.floor(10000 + Math.random() * 90000); // 5-digit OTP
      const existingOTP = await OTP.findOne({ OTP: generatedOTP });
      if (!existingOTP) isUnique = true;
    } while (!isUnique);

    // 6. Save the OTP and phone number in the database.
    const savedOTP = await OTP.create({
      phone,
      OTP: generatedOTP,
    });

    // 7. Respond: "OTP sent. Please verify within 5 minutes."
    res.status(httpStatus.CREATED).json({
      data: { otp: generatedOTP },
      success: true,
      message: "OTP sent successfully. Please verify within 5 minutes.",
      error: {},
    });
  } catch (error: any) {
    console.error("Error Occurred While Generating OTP:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      data: {},
      success: false,
      message: "Internal Server Error In Generating OTP",
      error: error.message || error,
    });
  }
};

export const VerifyOTP = async (req: Request, res: Response) => {
  try {
    // 1. Extract phone number, OTP, and type from request body
    const { phone, otp, type } = req.body;
    // 2. Validate all inputs (number format, OTP, and type)
    if (!phone || !type || !otp || otp.toString().length !== 5) {
      res.status(httpStatus.BAD_REQUEST).json({
        data: {},
        success: false,
        message: "Phone number, OTP, and type are required.",
        error: "Missing or invalid phone, OTP, or type in request body.",
      });
      return;
    }

    if (type !== "login" && type !== "signup") {
      res.status(httpStatus.BAD_REQUEST).json({
        data: {},
        success: false,
        message: "Invalid type provided.",
        error: "Type must be either 'login' or 'signup'.",
      });
      return;
    }

    if (!/^\+91[6-9]\d{9}$/.test(phone)) {
      res.status(httpStatus.BAD_REQUEST).json({
        data: {},
        success: false,
        message: "Invalid phone number format.",
        error: "Phone must be a valid Indian number starting with +91.",
      });
      return;
    }

    const user = await User.findOne({ phone });
    // 3. If type is "login", check if the number exists; if not, respond asking to sign up
    if (type === "login" && !user) {
      res.status(httpStatus.NOT_FOUND).json({
        data: {},
        success: false,
        message: "User not found. Please sign up.",
        error: "No user associated with this phone.",
      });
      return;
    }

    // 4. If type is "signup", ensure the number does not already exist; if it does, respond asking to log in
    if (type === "signup" && user) {
      res.status(httpStatus.CONFLICT).json({
        data: {},
        success: false,
        message: "User already exists. Please log in.",
        error: "Phone already registered.",
      });
      return;
    }

    // 5. Fetch the latest OTP entry from DB for the phone number
    const dbOTP = await OTP.findOne({ phone }).sort({ createdAt: -1 });
    if (!dbOTP) {
      res.status(httpStatus.BAD_REQUEST).json({
        data: {},
        success: false,
        message: "No OTP found for this phone number.",
        error: "OTP not generated or expired.",
      });
      return;
    }

    // 6. If OTP is expired, delete it and respond: "OTP expired" expired for login 5 min and for signup 15 minutes.
    const now = Date.now();
    const otpCreated = new Date(dbOTP.createdAt).getTime();
    const expiryTime = type === "login" ? 5 * 60 * 1000 : 15 * 60 * 1000; // 5 or 15 mins in ms

    if (now - otpCreated > expiryTime) {
      await OTP.deleteOne({ _id: dbOTP._id });
      res.status(httpStatus.CONFLICT).json({
        data: {},
        success: false,
        message: "OTP expired.",
        error: "OTP expired.",
      });
      return;
    }
    // 7. If OTP does not match, delete it and respond: "Wrong OTP"
    if (otp.toString() !== dbOTP.OTP.toString()) {
      await OTP.deleteOne({ _id: dbOTP._id });
      res.status(httpStatus.CONFLICT).json({
        data: {},
        success: false,
        message: "Wrong OTP entered.",
        error: "OTP incorrect.",
      });
      return;
    }
    // 8. If OTP is valid:
    //    a. For "signup": generate JWT with 15-min expiry, send as `tempToken` cookie
    //    b. For "login": generate JWT with 10-day expiry, send as `authToken` cookie
    const jwtExpiry = type === "signup" ? "15m" : "10d";
    const tokenName = type === "signup" ? "tempToken" : "authToken";

    const token = jwt.sign({ phone, type }, JWT_SECRET, {
      expiresIn: jwtExpiry,
    });

    // Set cookie
    res.cookie(tokenName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: type === "signup" ? 15 * 60 * 1000 : 10 * 24 * 60 * 60 * 1000, // ms
      sameSite: "strict",
    });

    // Delete OTP after verification.
    await OTP.deleteOne({ _id: dbOTP._id });

    // 9. Respond: "OTP verified successfully"
    res.status(httpStatus.OK).json({
      data: { token },
      success: true,
      message: "OTP verified successfully.",
      error: {},
    });
  } catch (error: any) {
    console.error("Error Occurred While Verifying OTP:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      data: {},
      success: false,
      message: "Internal Server Error In Verifying OTP",
      error: error.message || error,
    });
  }
};

export const Logout = async (req: Request, res: Response) => {
  try {
    // 1. Clear all cookies.
    res.clearCookie("authToken");
    res.clearCookie("tempToken");

    res.status(httpStatus.OK).json({
      data: {},
      success: true,
      message: "User Logged Out.",
      error: "",
    });
    // 2. Make response as user Signed out.
  } catch (error: any) {
    console.error("Error Occurred While Logout: ", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      data: {},
      success: false,
      message: "Internal Server Error In Logout.",
      error: error.message || error,
    });
  }
};

//   GenerateOTP:
//    1. Extract `phone` and `type` ("signup" or "login") from request body.
//    2. Validate:
//       - Both fields are present.
//       - Type is either "signup" or "login".
//       - Phone matches Indian format (+91XXXXXXXXXX).
//    3. Check user existence based on type:
//       - If type is "login", ensure user exists, else respond with error.
//       - If type is "signup", ensure user does not exist, else respond with error.
//    4. Generate a unique 5-digit OTP (check for duplicates in DB).
//    5. Save OTP with phone number to the database.
//    6. Respond with success message and OTP (for testing/dev env.).

//   VerifyOTP:
//    1. Extract `phone`, `otp`, and `type` from request body.
//    2. Validate:
//       - All fields are present.
//       - OTP is a 5-digit number.
//       - Type is either "signup" or "login".
//       - Phone matches Indian format.
//    3. Check user existence based on type:
//       - If type is "login", ensure user exists.
//       - If type is "signup", ensure user does not exist.
//    4. Fetch latest OTP from DB for the phone number.
//    5. Check OTP expiry time:
//       - 5 minutes for login.
//       - 15 minutes for signup.
//       - If expired → delete OTP and respond with error.
//    6. Check OTP match:
//       - If mismatch → delete OTP and respond with error.
//    7. If OTP is valid:
//       - Generate JWT token:
//          i. For "signup": 15-min expiry → set `tempToken` cookie.
//         ii. For "login": 10-day expiry → set `authToken` cookie.
//    8. Delete OTP after verification.
//    9. Respond with success message and token.

//   Logout:
//    1. Clear `authToken` cookie.
//    2. Respond with logout success message.

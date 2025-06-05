import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "RitickSecret";

// Middleware to check tempToken for signup process
export const tempTokenCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tempToken } = req.cookies;

    if (!tempToken) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized: tempToken missing.",
        data: {},
        error: "tempToken not found in cookies.",
      });
      return;
    }

    try {
      const decoded = jwt.verify(tempToken, JWT_SECRET) as {
        type: string;
        phone: string;
      };

      if (decoded.type !== "signup" || !decoded.phone) {
        res.status(httpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Invalid token type for profile creation.",
          data: {},
          error: "Invalid token type or missing phone number.",
        });
        return;
      }

      // Attach phone to request
      // @ts-ignore
      req.tempPhone = decoded.phone;

      next();
    } catch (err) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Invalid or expired token.",
        data: {},
        error: "JWT verification failed.",
      });
      return;
    }
  } catch (error: any) {
    console.error("Error in tempTokenCheck middleware:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error in token middleware.",
      data: {},
      error: error.message || error,
    });
    return;
  }
};

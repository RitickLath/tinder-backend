import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "RitickSecret";

export const authCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authToken } = req.cookies;

    if (!authToken) {
      res.status(httpStatus.BAD_REQUEST).json({
        data: {},
        success: false,
        message: "AuthToken not provided.",
        error: "AuthToken not provided.",
      });
      return;
    }

    try {
      const decoded = jwt.verify(authToken, JWT_SECRET) as { phone: string };

      // Attach phone number to request
      // @ts-ignore
      req.ph = decoded.phone;

      next();
    } catch (err) {
      res.status(httpStatus.UNAUTHORIZED).json({
        data: {},
        success: false,
        message: "Invalid or expired AuthToken.",
        error: "AuthToken not correct or expired.",
      });
      return;
    }
  } catch (error: any) {
    console.error("Error in authCheck middleware:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      data: {},
      success: false,
      message: "Internal server error in authentication middleware.",
      error: error.message || error,
    });
    return;
  }
};

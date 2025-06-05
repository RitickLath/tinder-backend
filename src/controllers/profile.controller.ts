import { Request, Response } from "express";
import httpStatus from "http-status";

export const createProfile = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    console.error("Error Occurred While Creating Profile:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      data: {},
      success: false,
      message: "Internal Server Error While Creating Profile.",
      error: error.message || error,
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    console.error("Error Occurred While Profile Update: ", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      data: {},
      success: false,
      message: "Internal Server Error In Profile Update.",
      error: error,
    });
  }
};

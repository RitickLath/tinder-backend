import express from "express";
import { GenerateOTP, Logout, VerifyOTP } from "../../controllers";

export const AuthRouter = express.Router();

AuthRouter.post("/generate-otp", GenerateOTP);

AuthRouter.post("/verify-otp", VerifyOTP);

AuthRouter.post("/logout", Logout);

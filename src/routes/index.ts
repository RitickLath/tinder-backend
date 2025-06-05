import express from "express";
import { AuthRouter, ProfileRouter } from "./v1";

export const MainRouter = express.Router();

MainRouter.use("/api/v1/auth", AuthRouter);

MainRouter.use("/api/v1/profile", ProfileRouter);

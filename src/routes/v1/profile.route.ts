import express from "express";
import { createProfile, updateProfile } from "../../controllers";
import { tempTokenCheck, authCheck } from "../../middlewares";

export const ProfileRouter = express.Router();

// Create Profile
// need improvement here in middleware
ProfileRouter.post("/", tempTokenCheck, createProfile);

// Update Profile
ProfileRouter.patch("/", authCheck, updateProfile);

import express from "express";

const ProfileRouter = express.Router();

// Create Profile
ProfileRouter.post("/profile");

// Update Profile
ProfileRouter.patch("/profile");


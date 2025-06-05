import express from "express";

export const ProfileRouter = express.Router();

// Create Profile
ProfileRouter.post("/", (req, res) => {
  res.json({ success: true });
});

// Update Profile
ProfileRouter.patch("/", (req, res) => {
  res.json({ success: true });
});

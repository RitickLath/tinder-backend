// One to one

import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  images: {
    type: [String],
    required: true,
  },
});

export const Image = mongoose.model("Image", imageSchema);

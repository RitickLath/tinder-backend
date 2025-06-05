// Many to many relationship with user

import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "From User is Must."],
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "To User is Must."],
    },
    status: {
      type: String,
      enum: ["Interested", "Not-Interested", "Match", ""],
    },
  },
  { timestamps: true }
);

// Make the combination of fromUserId and toUserId as unique.
connectionSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

export const Connection = mongoose.model("Connection", connectionSchema);

// One to one relationship with user

import mongoose from "mongoose";
import {
  GENDERS,
  SEXUAL_ORIENTATIONS,
  INTERESTED_IN,
  LOOKING_FOR,
  DRINK_OPTIONS,
  SMOKE_OPTIONS,
  WORKOUT_OPTIONS,
  COMMUNICATION_STYLES,
  ENGAGED_IN_ACTIVITIES,
} from "../constants";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: [true, "User ID is required"],
    },
    gender: {
      type: String,
      enum: {
        values: GENDERS,
        message: "Gender must be Male, Female, or Other",
      },
      required: [true, "Gender is required"],
    },
    address: {
      type: String,
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
      maxlength: [100, "Bio cannot exceed 30 characters"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      validate: {
        validator: (v: number) => v >= 18 && v < 65,
        message: "Age must be less than 65",
      },
    },
    sexualOrientation: {
      type: String,
      enum: {
        values: SEXUAL_ORIENTATIONS,
        message: "Invalid sexual orientation",
      },
      default: "Straight",
    },
    interestedIn: {
      type: String,
      enum: {
        values: INTERESTED_IN,
        message: "Invalid interestedIn option",
      },
      default: "Everyone",
    },
    lookingFor: {
      type: String,
      enum: {
        values: LOOKING_FOR,
        message: "Invalid lookingFor option",
      },
    },
    studying: {
      type: String,
      trim: true,
    },
    drink: {
      type: String,
      enum: {
        values: DRINK_OPTIONS,
        message: "Invalid drink option",
      },
    },
    smoke: {
      type: String,
      enum: {
        values: SMOKE_OPTIONS,
        message: "Invalid smoke option",
      },
    },
    workout: {
      type: String,
      enum: {
        values: WORKOUT_OPTIONS,
        message: "Invalid workout option",
      },
    },
    communicationStyle: {
      type: String,
      enum: {
        values: COMMUNICATION_STYLES,
        message: "Invalid communication style",
      },
    },
    educationLevel: {
      type: String,
      trim: true,
    },
    movie: {
      type: String,
      trim: true,
    },
    engagedIn: {
      type: String,
      enum: {
        values: ENGAGED_IN_ACTIVITIES,
        message: "Invalid activity",
      },
    },
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);

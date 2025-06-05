// One to one relationship with user

import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema(
  {
    OTP: {
      type: [String],
      unique: true,
      trim: true,
      required: [true, "OTP is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      index: true,
      validate: {
        validator: (v: string) => /^\+91[6-9]\d{9}$/.test(v),
        message: (props: any) =>
          `${props.value} is not a valid Indian phone number (format: +91XXXXXXXXXX)`,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const OTP = mongoose.model("OTP", OTPSchema);

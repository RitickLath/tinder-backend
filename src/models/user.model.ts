import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: [30, "Name can't exceed 30 characters"],
      required: [true, "Name is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      index: true,
      validate: {
        validator: (v: string) => /^\+91[6-9]\d{9}$/.test(v),
        message: (props: any) =>
          `${props.value} is not a valid Indian phone number (format: +91XXXXXXXXXX)`,
      },
    },
    isPremiumUser: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);

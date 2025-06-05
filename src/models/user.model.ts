import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
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

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);

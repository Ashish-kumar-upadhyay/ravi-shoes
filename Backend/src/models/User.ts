import mongoose, { Schema, models, model } from "mongoose";
import type { IUser } from "@/types";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: false, unique: true, sparse: true },
    password: { type: String, required: false, select: false },
    googleId: { type: String, required: false, unique: true, sparse: true },
    provider: { type: String, enum: ["local", "google"], default: "local" },
    picture: { type: String, required: false },
    otp: { type: String, required: false },
    otpExpiry: { type: Date, required: false },
  },
  { timestamps: true },
);

export const User = models.User || model<IUser>("User", UserSchema);

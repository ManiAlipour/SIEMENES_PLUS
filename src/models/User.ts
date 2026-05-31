import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";

  verified: boolean;
  verificationCode?: string | null;

  active: boolean;
  isDeleted: boolean;

  // Reset password
  resetPasswordTokenHash?: string | null;
  resetPasswordExpiresAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    verified: { type: Boolean, default: false },
    verificationCode: { type: String, default: null },

    active: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },

    resetPasswordTokenHash: { type: String, default: null },
    resetPasswordExpiresAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

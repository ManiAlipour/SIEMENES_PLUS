import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email?: string | null;
  password: string;
  role: "user" | "admin";
  phoneNumber: string;

  verified: boolean;

  verificationCodeHash?: string | null;
  verificationCodeExpiresAt?: Date | null;
  verificationAttempts: number;
  lastOtpSentAt?: Date | null;

  active: boolean;
  isDeleted: boolean;

  resetPasswordTokenHash?: string | null;
  resetPasswordExpiresAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      default: undefined,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    verified: {
      type: Boolean,
      default: false,
    },

    verificationCodeHash: {
      type: String,
      default: null,
    },

    verificationCodeExpiresAt: {
      type: Date,
      default: null,
    },

    verificationAttempts: {
      type: Number,
      default: 0,
    },

    lastOtpSentAt: {
      type: Date,
      default: null,
    },

    active: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    resetPasswordTokenHash: {
      type: String,
      default: null,
    },

    resetPasswordExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

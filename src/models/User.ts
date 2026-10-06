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

  passwordResetCodeHash: string | null;
  passwordResetCodeExpiresAt: Date | null;
  passwordResetAttempts: number;
  passwordResetLastSentAt: Date | null;

  tokenVersion: number;

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

    passwordResetCodeHash: {
      type: String,
      default: null,
    },
    passwordResetCodeExpiresAt: {
      type: Date,
      default: null,
    },
    passwordResetAttempts: {
      type: Number,
      default: 0,
    },
    passwordResetLastSentAt: {
      type: Date,
      default: null,
    },
    tokenVersion: {
      type: Number,
      default: 0,
      required: true,
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

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { redirect } from "next/dist/server/api-utils";

interface ITokenData {
  _id: string;
  email: string;
  role: "user" | "admin";
  verified: boolean;
  active: boolean;
  isDeleted: boolean;
}

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

export function generateToken(user: ITokenData) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      verified: user.verified,
      active: user.active,
      isDeleted: user.isDeleted,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" },
  );
}

export async function signup({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) throw new Error("User already exists");

  const hashed = await bcrypt.hash(password, 10);

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  const user = await User.create({
    name,
    email,
    password: hashed,
    verificationCode,
  });

  await transporter.sendMail({
    from: `"Control Room Auth" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your account",
    text: `Welcome, ${name}! Your verification code is ${verificationCode}.`,
  });

  return {
    message: "Signup successful, check your email for verification code",
  };
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  await connectDB();

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  if (!user.active)
    throw new Error(
      "حساب کاربری شما مسدود شده است. لطفا با پشتیبانی تماس بگیرید.",
    );
  if (!user.verified) throw new Error("Account not verified");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken(user as ITokenData);

  return {
    token,
    user: mapUserToTokenData(user),
  };
}

export async function verifyEmail({
  email,
  code,
}: {
  email: string;
  code: string;
}) {
  await connectDB();

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  if (user.verificationCode !== code)
    throw new Error("Invalid verification code");

  user.verified = true;
  user.verificationCode = null;
  await user.save();

  const token = generateToken(user as ITokenData);

  return {
    message: "Account verified successfully",
    token,
    user: mapUserToTokenData(user),
  };
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!) as {
    id: string;
    email: string;
    role: "admin" | "user";
    verified: boolean;
    active: boolean;
    isDeleted: boolean;
  };
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  active: boolean;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function mapUserToTokenData(user: any): ITokenData {
  return {
    _id: user._id.toString(),
    email: user.email,
    role: user.role,
    verified: user.verified,
    active: user.active,
    isDeleted: user.isDeleted,
  };
}

import { IUser } from "@/models/User";

export function sanitizeUser(user: IUser): SafeUser {
  return {
    id: user._id?.toString() as string,
    name: user.name,
    email: user.email,
    role: user.role,
    verified: user.verified,
    active: user.active,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

function generateToken(id: string, role: "user" | "admin", email: string) {
  return jwt.sign({ id, role: role, email: email }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });
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
    100000 + Math.random() * 900000
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
  if (!user.verified) throw new Error("Account not verified");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken(user._id!.toString(), user.role, user.email);

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
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

  // تولید توکن بعد از تأیید ایمیل
  const token = generateToken(user._id!.toString(), user.role, user.email);

  return {
    message: "Account verified successfully",
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  };
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!) as {
    id: string;
    role: "admin" | "user";
    email: string;
  };
}

interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  verified: boolean;
  verificationCode: null | string;
  createdAt: string;
  updatedAt: string;
}

/**
 * فیلتر کردن فیلدهای حساس کاربر قبل از ارسال به کلاینت
 */
export function sanitizeUser(user: User) {
  const { _id, name, email, role, verified, createdAt, updatedAt } = user;

  return {
    id: _id,
    name,
    email,
    role,
    verified,
    createdAt,
    updatedAt,
  };
}

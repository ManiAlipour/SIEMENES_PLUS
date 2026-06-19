import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { createHash, randomBytes } from "node:crypto";

interface ITokenData {
  _id: string;
  email: string;
  role: "user" | "admin";
  verified: boolean;
  active: boolean;
  isDeleted: boolean;
}

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: 587,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

export const sendVerificationCode = async (
  verificationCode: string,
  email: string,
  name: string,
) => {
  await transporter.sendMail({
    from: `"Control Room Auth" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "تأیید ایمیل حساب کاربری",
    text: `
  ${name} عزیز،
  
   خوش آمدید 
  
  کد تأیید حساب کاربری شما:
  ${verificationCode}
  
  اگر این درخواست توسط شما انجام نشده، لطفاً این ایمیل را نادیده بگیرید.
  
  با احترام
  تیم Control Room
    `,
    html: `
    <div style="
      font-family: Tahoma, Arial, sans-serif;
      background-color: #f6f7f9;
      padding: 24px;
      direction: rtl;
    ">
      <div style="
        max-width: 520px;
        margin: auto;
        background-color: #ffffff;
        border-radius: 12px;
        padding: 32px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      ">
        <h2 style="margin-top: 0; color: #111827;">
          👋 ${name} عزیز، خوش آمدید
        </h2>
  
        <p style="color: #374151; font-size: 15px; line-height: 1.8;">
          برای تکمیل فرایند تأیید حساب کاربری خود در <strong>ثبت نام</strong>،
          لطفاً از کد زیر استفاده کنید:
        </p>
  
        <div style="
          margin: 24px 0;
          padding: 16px;
          background-color: #f3f4f6;
          border-radius: 8px;
          text-align: center;
          font-size: 24px;
          letter-spacing: 4px;
          font-weight: bold;
          color: #111827;
        ">
          ${verificationCode}
        </div>
  
        <p style="color: #6b7280; font-size: 14px; line-height: 1.7;">
          اگر این درخواست توسط شما انجام نشده است،
          می‌توانید این ایمیل را نادیده بگیرید.
        </p>
  
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
  
        <p style="color: #9ca3af; font-size: 13px;">
          با احترام <br />
          تیم <strong>زیمنس پلاس</strong>
        </p>
      </div>
    </div>
    `,
  });
};

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

  await sendVerificationCode(verificationCode, email, name);

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

  const token = generateToken({
    ...user,
    _id: `${user._id}`,
  } as ITokenData);

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

  const token = generateToken({
    ...user,
    _id: `${user._id}`,
  } as ITokenData);

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

export async function resendVerificationCode({ email }: { email: string }) {
  await connectDB();

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  if (!user.active)
    throw new Error(
      "حساب کاربری شما مسدود شده است. لطفا با پشتیبانی تماس بگیرید.",
    );

  if (user.verified) {
    return { message: "Account is already verified" };
  }

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  user.verificationCode = verificationCode;
  await user.save();

  await sendVerificationCode(verificationCode, user.email, user.name);

  return {
    message: "Verification code sent, check your email",
  };
}

export async function resetPassword({
  email,
  token,
  newPassword,
}: {
  email: string;
  token: string;
  newPassword: string;
}) {
  await connectDB();

  const user = await User.findOne({ email });

  if (!user) throw new Error("کاربر یافت نشد");

  const tokenHash = createHash("sha256").update(token).digest("hex");

  const isValid =
    user.resetPasswordTokenHash &&
    user.resetPasswordTokenHash === tokenHash &&
    user.resetPasswordExpiresAt &&
    user.resetPasswordExpiresAt.getTime() > Date.now();

  if (!isValid) {
    if (user.resetPasswordTokenHash !== tokenHash) {
      throw new Error("توکن مطابقت ندارد (Invalid Token)");
    }
    if (
      user.resetPasswordExpiresAt &&
      user.resetPasswordExpiresAt.getTime() <= Date.now()
    ) {
      throw new Error("توکن منقضی شده است");
    }
    throw new Error("اطلاعات بازیابی نامعتبر است");
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  user.resetPasswordTokenHash = null;
  user.resetPasswordExpiresAt = null;
  await user.save();

  return { message: "رمز عبور با موفقیت تغییر کرد" };
}

export async function sendResetPasswordEmail({
  email,
  name,
  resetLink,
}: {
  email: string;
  name: string;
  resetLink: string;
}) {
  await transporter.sendMail({
    from: `"Control Room Auth" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "بازیابی رمز عبور",
    text: `${name} عزیز\n\nبرای تغییر رمز عبور روی لینک زیر کلیک کنید:\n${resetLink}\n\nاگر شما درخواست نداده‌اید این ایمیل را نادیده بگیرید.`,
    html: `
      <div style="font-family:Tahoma,Arial,sans-serif;background:#f6f7f9;padding:24px;direction:rtl">
        <div style="max-width:520px;margin:auto;background:#fff;border-radius:12px;padding:32px;box-shadow:0 4px 12px rgba(0,0,0,.08)">
          <h2 style="margin:0 0 12px;color:#111827">بازیابی رمز عبور</h2>
          <p style="color:#374151;line-height:1.9;font-size:14px">
            ${name} عزیز، برای تنظیم رمز عبور جدید روی دکمه زیر کلیک کنید:
          </p>
          <div style="margin:20px 0;text-align:center">
            <a href="${resetLink}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:700">
              تغییر رمز عبور
            </a>
          </div>
          <p style="color:#6b7280;font-size:13px;line-height:1.8">
            اگر شما درخواست بازیابی نداده‌اید، این ایمیل را نادیده بگیرید.
          </p>
        </div>
      </div>
    `,
  });
}

export async function forgotPassword({ email }: { email: string }) {
  await connectDB();

  const generic = {
    message:
      "اگر حسابی با این ایمیل وجود داشته باشد، لینک بازیابی ارسال می‌شود.",
  };

  const user = await User.findOne({ email });
  if (!user) return generic;

  if (!user.active || user.isDeleted) return generic;

  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 دقیقه

  user.resetPasswordTokenHash = tokenHash;
  user.resetPasswordExpiresAt = expiresAt;
  await user.save();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!baseUrl) throw new Error("NEXT_PUBLIC_APP_URL is not set");

  const resetLink = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(
    user.email,
  )}`;

  await sendResetPasswordEmail({
    email: user.email,
    name: user.name,
    resetLink,
  });

  return generic;
}

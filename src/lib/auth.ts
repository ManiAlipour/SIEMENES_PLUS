import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User, { IUser } from "@/models/User";
import { generateOtpCode, hashOtp, otpMatches } from "./otp";
import { normalizeIranPhone } from "./phone";
import { sendOtpSms } from "./sms";

const OTP_EXPIRES_IN_MS = 5 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const SMS_OTP_TEMPLATE_ID = 462822;
const SMS_RESET_PASS_TEMPLATE_ID = 652327;

export interface IRegister {
  phoneNumber: string;
  name: string;
  password: string;
}

export interface ILogin {
  phoneNumber: string;
  password: string;
}

export interface IVerifyOtp {
  phoneNumber: string;
  code: string;
}

export interface IForgotPassword {
  phoneNumber: string;
}

export interface IResetPassword {
  phoneNumber: string;
  code: string;
  newPassword: string;
}

export interface SafeUser {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string | null;
  role: "user" | "admin";
  verified: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITokenPayload {
  id: string;
  phoneNumber: string;
  role: "user" | "admin";
}

export function sanitizeUser(user: IUser): SafeUser {
  return {
    id: user._id.toString(),
    name: user.name,
    phoneNumber: user.phoneNumber,
    email: user.email ?? null,
    role: user.role,
    verified: user.verified,
    active: user.active,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function generateToken(user: IUser): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");

  const payload: ITokenPayload = {
    id: user._id.toString(),
    phoneNumber: user.phoneNumber,
    role: user.role,
  };

  return jwt.sign(payload, secret, { expiresIn: "30d" });
}

export function verifyToken(token: string): ITokenPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");

  return jwt.verify(token, secret) as ITokenPayload;
}

export async function register({ name, password, phoneNumber }: IRegister) {
  await connectDB();

  const normalizedPhone = normalizeIranPhone(phoneNumber);

  const existingUser = await User.findOne({ phoneNumber: normalizedPhone });
  if (existingUser) {
    if (existingUser.verified) {
      throw new Error("شما قبلاً ثبت‌نام کرده‌اید. لطفاً وارد شوید.");
    }
    throw new Error(
      "شماره شما ثبت شده اما تأیید نشده است. لطفاً کد تأیید را وارد کنید.",
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const otp = generateOtpCode();
  const hashedOtp = hashOtp(otp);
  const verificationCodeExpiresAt = new Date(Date.now() + OTP_EXPIRES_IN_MS);

  const user = await User.create({
    name: name.trim(),
    phoneNumber: normalizedPhone,
    password: hashedPassword,
    verified: false,
    active: true,
    verificationCodeHash: hashedOtp,
    verificationCodeExpiresAt,
    verificationAttempts: 0,
  });

  try {
    const smsRes = await sendOtpSms({
      mobile: normalizedPhone!,
      templateId: SMS_OTP_TEMPLATE_ID,
      parameters: [
        { name: "CODE", value: otp },
        { name: "TIME", value: "5" },
      ],
    });

    if (!smsRes.success) {
      console.error("SMS sending failed:", smsRes.message);
    }
  } catch (smsError) {
    console.error("Error in SMS service:", smsError);
  }

  return {
    message: "ثبت‌نام با موفقیت انجام شد. کد تأیید ۵ رقمی ارسال گردید.",
    phoneNumber: normalizedPhone,
  };
}

export async function verifyOtp({ phoneNumber, code }: IVerifyOtp) {
  await connectDB();

  const normalizedPhone = normalizeIranPhone(phoneNumber);
  const user = await User.findOne({
    phoneNumber: normalizedPhone,
    isDeleted: false,
  });

  if (!user) {
    throw new Error("کاربری با این شماره یافت نشد.");
  }

  if (user.verified) {
    const token = generateToken(user);
    return {
      message: "شماره شما قبلاً تأیید شده است.",
      token,
      user: sanitizeUser(user),
    };
  }

  // چک کردن وجود و انقضای کد
  if (!user.verificationCodeHash || !user.verificationCodeExpiresAt) {
    throw new Error("کد تأیید فعالی یافت نشد. لطفاً درخواست کد جدید دهید.");
  }

  if (user.verificationCodeExpiresAt.getTime() < Date.now()) {
    throw new Error("کد تأیید منقضی شده است (اعتبار ۵ دقیقه به پایان رسیده).");
  }

  if (user.verificationAttempts >= MAX_OTP_ATTEMPTS) {
    throw new Error(
      "تعداد تلاش‌های اشتباه بیش از حد مجاز بود. لطفاً کد جدید دریافت کنید.",
    );
  }

  const isValid = otpMatches(code, user.verificationCodeHash);

  if (!isValid) {
    user.verificationAttempts += 1;
    await user.save();
    const remainingAttempts = MAX_OTP_ATTEMPTS - user.verificationAttempts;
    throw new Error(
      `کد وارد شده اشتباه است. (${remainingAttempts} تلاش باقی‌مانده)`,
    );
  }

  user.verified = true;
  user.verificationCodeHash = null;
  user.verificationCodeExpiresAt = null;
  user.verificationAttempts = 0;
  await user.save();

  const token = generateToken(user);

  return {
    message: "شماره موبایل با موفقیت تأیید شد.",
    token,
    user: sanitizeUser(user),
  };
}

export async function login({ phoneNumber, password }: ILogin) {
  await connectDB();

  const normalizedPhone = normalizeIranPhone(phoneNumber);
  const user = await User.findOne({
    phoneNumber: normalizedPhone,
    isDeleted: false,
  });

  if (!user) {
    throw new Error("شماره موبایل یا رمز عبور اشتباه است.");
  }

  if (!user.active) {
    throw new Error("حساب کاربری شما مسدود شده است. با پشتیبانی تماس بگیرید.");
  }

  if (!user.verified) {
    throw new Error(
      "شماره موبایل هنوز تأیید نشده است. لطفاً ابتدا کد تأیید را ثبت کنید.",
    );
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("شماره موبایل یا رمز عبور اشتباه است.");
  }

  const token = generateToken(user);

  return {
    message: "ورود با موفقیت انجام شد.",
    token,
    user: sanitizeUser(user),
  };
}

export async function resendOtp({ phoneNumber }: { phoneNumber: string }) {
  await connectDB();

  const normalizedPhone = normalizeIranPhone(phoneNumber);
  const user = await User.findOne({
    phoneNumber: normalizedPhone,
    isDeleted: false,
  });

  if (!user) {
    throw new Error("کاربری با این شماره وجود ندارد.");
  }

  if (user.verified) {
    throw new Error("شماره موبایل قبلاً تأیید شده است.");
  }

  // محدودیت کول‌داون (۱ دقیقه فاصله بین ارسال‌ها)
  if (user.verificationCodeExpiresAt) {
    const issuedAt =
      user.verificationCodeExpiresAt.getTime() - OTP_EXPIRES_IN_MS;
    const cooldownEnd = issuedAt + OTP_RESEND_COOLDOWN_MS;

    if (Date.now() < cooldownEnd) {
      const remainingSeconds = Math.ceil((cooldownEnd - Date.now()) / 1000);
      throw new Error(`لطفاً ${remainingSeconds} ثانیه دیگر مجدداً تلاش کنید.`);
    }
  }

  const otp = generateOtpCode();
  const hashedOtp = hashOtp(otp);

  user.verificationCodeHash = hashedOtp;
  user.verificationCodeExpiresAt = new Date(Date.now() + OTP_EXPIRES_IN_MS);
  user.verificationAttempts = 0;
  await user.save();

  await sendOtpSms({
    mobile: normalizedPhone!,
    templateId: SMS_OTP_TEMPLATE_ID,
    parameters: [
      { name: "CODE", value: otp },
      { name: "TIME", value: "5" },
    ],
  });

  return {
    message: "کد تأیید جدید با موفقیت ارسال شد.",
  };
}

const PASSWORD_RESET_GENERIC_MESSAGE =
  "اگر حساب کاربری فعالی با این شماره وجود داشته باشد، کد بازیابی ارسال می‌شود.";

export async function forgotPassword({ phoneNumber }: IForgotPassword) {
  await connectDB();

  const normalizedPhone = normalizeIranPhone(phoneNumber);

  const user = await User.findOne({
    phoneNumber: normalizedPhone,
    isDeleted: false,
    verified: true,
    active: true,
  });

  if (!user) {
    return { message: PASSWORD_RESET_GENERIC_MESSAGE };
  }

  if (user.passwordResetLastSentAt) {
    const elapsed = Date.now() - user.passwordResetLastSentAt.getTime();

    if (elapsed < OTP_RESEND_COOLDOWN_MS) {
      return { message: PASSWORD_RESET_GENERIC_MESSAGE };
    }
  }

  const otp = generateOtpCode();

  user.passwordResetCodeHash = hashOtp(otp);
  user.passwordResetCodeExpiresAt = new Date(Date.now() + OTP_EXPIRES_IN_MS);
  user.passwordResetAttempts = 0;
  user.passwordResetLastSentAt = new Date();

  await user.save();

  try {
    const smsRes = await sendOtpSms({
      mobile: normalizedPhone!,
      templateId: SMS_RESET_PASS_TEMPLATE_ID,
      parameters: [{ name: "CODE", value: otp }],
    });

    if (!smsRes.success) {
      console.error("Password reset SMS failed:", smsRes.message);
    }
  } catch (error) {
    console.error("Password reset SMS error:", error);
  }

  return { message: PASSWORD_RESET_GENERIC_MESSAGE };
}

export async function resetPassword({
  phoneNumber,
  code,
  newPassword,
}: IResetPassword) {
  await connectDB();

  const normalizedPhone = normalizeIranPhone(phoneNumber);

  const user = await User.findOne({
    phoneNumber: normalizedPhone,
    isDeleted: false,
    verified: true,
    active: true,
  });

  const invalidCodeMessage = "کد بازیابی معتبر نیست یا منقضی شده است.";

  if (
    !user ||
    !user.passwordResetCodeHash ||
    !user.passwordResetCodeExpiresAt
  ) {
    throw new Error(invalidCodeMessage);
  }

  if (user.passwordResetAttempts >= MAX_OTP_ATTEMPTS) {
    user.passwordResetCodeHash = null;
    user.passwordResetCodeExpiresAt = null;
    await user.save();

    throw new Error(invalidCodeMessage);
  }

  if (user.passwordResetCodeExpiresAt.getTime() <= Date.now()) {
    user.passwordResetCodeHash = null;
    user.passwordResetCodeExpiresAt = null;
    await user.save();

    throw new Error(invalidCodeMessage);
  }

  const isValid = otpMatches(code, user.passwordResetCodeHash);

  if (!isValid) {
    user.passwordResetAttempts += 1;
    await user.save();

    throw new Error(invalidCodeMessage);
  }

  user.password = await bcrypt.hash(newPassword, 12);

  user.passwordResetCodeHash = null;
  user.passwordResetCodeExpiresAt = null;
  user.passwordResetAttempts = 0;

  await user.save();

  return {
    message: "رمز عبور با موفقیت تغییر کرد.",
  };
}

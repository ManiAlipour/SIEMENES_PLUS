import { createHash, randomInt } from "node:crypto";

export const OTP_TTL_MS = 5 * 60 * 1000;
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;

export function generateOtpCode(): string {
  return randomInt(100000, 1000000).toString();
}

export function hashOtp(code: string): string {
  const pepper = process.env.JWT_SECRET || "otp";
  return createHash("sha256").update(`${pepper}:${code}`).digest("hex");
}

export function otpMatches(code: string, hash: string | null | undefined) {
  if (!hash) return false;
  return hashOtp(code) === hash;
}

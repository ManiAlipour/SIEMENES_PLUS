import { z } from "zod";

const toEnglishDigits = (str: string): string => {
  const persianDigits = [
    /۰/g,
    /۱/g,
    /۲/g,
    /۳/g,
    /۴/g,
    /۵/g,
    /۶/g,
    /۷/g,
    /۸/g,
    /۹/g,
  ];
  const arabicDigits = [
    /٠/g,
    /١/g,
    /٢/g,
    /٣/g,
    /٤/g,
    /٥/g,
    /٦/g,
    /٧/g,
    /٨/g,
    /٩/g,
  ];

  let output = str;
  for (let i = 0; i < 10; i++) {
    output = output
      .replace(persianDigits[i], String(i))
      .replace(arabicDigits[i], String(i));
  }
  return output;
};

export const iranianPhoneSchema = z
  .string({ required_error: "شماره موبایل الزامی است." })
  .trim()
  .transform(toEnglishDigits)
  .refine(
    (phone) => /^(\+98|0098|98|0)?9\d{9}$/.test(phone),
    "شماره موبایل وارد شده معتبر نیست (مثال: 09121234567)",
  );

export const otpCodeSchema = z
  .string({ required_error: "کد تایید الزامی است." })
  .trim()
  .transform(toEnglishDigits)
  .refine((code) => /^\d{6}$/.test(code), "کد تایید باید یک عدد ۶ رقمی باشد.");

export const passwordSchema = z
  .string({ required_error: "رمز عبور الزامی است." })
  .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد.")
  .max(100, "رمز عبور طولانی‌تر از حد مجاز است.");

export const nameSchema = z
  .string({ required_error: "نام و نام خانوادگی الزامی است." })
  .trim()
  .min(3, "نام باید حداقل ۳ حرف باشد.")
  .max(50, "نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد.");

export const emailOptionalSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("فرمت ایمیل نامعتبر است.")
  .optional()
  .or(z.literal("").transform(() => null))
  .nullable();

export const registerSchema = z.object({
  name: nameSchema,
  phoneNumber: iranianPhoneSchema,
  password: passwordSchema,
  email: emailOptionalSchema,
});

export const loginSchema = z.object({
  phoneNumber: iranianPhoneSchema,
  password: z
    .string({ required_error: "رمز عبور الزامی است." })
    .min(1, "رمز عبور نمی‌تواند خالی باشد."),
});

export const verifyOtpSchema = z.object({
  phoneNumber: iranianPhoneSchema,
  code: otpCodeSchema,
});

export const resendOtpSchema = z.object({
  phoneNumber: iranianPhoneSchema,
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "رمز عبور فعلی الزامی است."),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "تکرار رمز عبور جدید الزامی است."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "رمز عبور جدید با تکرار آن مطابقت ندارد.",
    path: ["confirmPassword"],
  });

export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  email: emailOptionalSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

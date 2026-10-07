import { z } from "zod";

// تابع کمکی برای تبدیل اعداد فارسی/عربی به انگلیسی
const normalizePhoneNumber = (val: string) => {
  if (!val) return "";
  const persianNumbers = [
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
  const arabicNumbers = [
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

  let formatted = val.trim();
  for (let i = 0; i < 10; i++) {
    formatted = formatted
      .replace(persianNumbers[i], String(i))
      .replace(arabicNumbers[i], String(i));
  }
  return formatted;
};

// اعتبارسنجی شماره موبایل ایران
const phoneValidation = z
  .string()
  .min(1, "شماره موبایل الزامی است")
  .transform(normalizePhoneNumber)
  .refine(
    (val) => /^(\+98|0)?9\d{9}$/.test(val),
    "شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)",
  );

// اعتبارسنجی کد تأیید ۶ رقمی
const codeValidation = z
  .string()
  .min(1, "کد تأیید الزامی است")
  .transform(normalizePhoneNumber)
  .refine((val) => /^\d{6}$/.test(val), "کد تأیید باید ۶ رقم عددی باشد");

/** Zod schema for register form: name, phoneNumber, password */
export const registerSchema = z.object({
  name: z.string().min(2, "نام حداقل باید ۲ کاراکتر باشد"),
  phoneNumber: phoneValidation,
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

/** Zod schema for login form: phoneNumber, password */
export const loginSchema = z.object({
  phoneNumber: phoneValidation,
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

/** Zod schema for verify form: phoneNumber, code (6 digits) */
export const verifySchema = z.object({
  phoneNumber: phoneValidation,
  code: codeValidation,
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type VerifyFormData = z.infer<typeof verifySchema>;

const schemaMap = {
  register: registerSchema,
  login: loginSchema,
  verify: verifySchema,
} as const;

export type AuthMode = keyof typeof schemaMap;

/** Get the schema and inferred form type for the given auth mode */
export function getAuthSchema(mode: AuthMode) {
  return schemaMap[mode];
}

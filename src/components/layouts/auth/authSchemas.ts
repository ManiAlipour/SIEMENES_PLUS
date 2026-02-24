import { z } from "zod";

/** Zod schema for register form: name, email, password */
export const registerSchema = z.object({
  name: z.string().min(2, "نام حداقل باید ۲ کاراکتر باشد"),
  email: z.string().email("ایمیل معتبر نیست"),
  password: z.string().min(6, "حداقل ۶ کاراکتر"),
});

/** Zod schema for login form: email, password */
export const loginSchema = z.object({
  email: z.string().email("ایمیل معتبر نیست"),
  password: z.string().min(6, "حداقل ۶ کاراکتر"),
});

/** Zod schema for verify form: email, code (6 digits) */
export const verifySchema = z.object({
  email: z.string().email("ایمیل معتبر نیست"),
  code: z.string().length(6, "کد باید ۶ رقم باشد"),
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

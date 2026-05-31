"use client";

import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiLock, FiLoader, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

import InputField from "./InputField"; // فرض بر اینکه InputField رو داری

// شمای اعتبارسنجی
const resetSchema = z
  .object({
    password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن مطابقت ندارند",
    path: ["confirmPassword"],
  });

type ResetFormData = z.infer<typeof resetSchema>;

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // استخراج اطلاعات از URL
  const email = useMemo(() => searchParams.get("email"), [searchParams]);
  const token = useMemo(() => searchParams.get("token"), [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  // اگر توکن یا ایمیل نباشه، فرم رو نشون نمی‌دیم
  if (!email || !token) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-2xl border-2 border-red-100">
        <FiAlertCircle className="mx-auto text-4xl text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">لینک نامعتبر</h2>
        <p className="text-gray-600">
          لینک بازیابی رمز عبور منقضی شده یا ناقص است.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="mt-4 text-primary font-bold hover:underline"
        >
          بازگشت به صفحه ورود
        </button>
      </div>
    );
  }

  const onSubmit = async (data: ResetFormData) => {
    setLoading(true);
    setServerError(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "خطایی در عملیات رخ داد");
      }

      toast.success("رمز عبور با موفقیت تغییر کرد");

      // هدایت به لاگین بعد از ۲ ثانیه
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      setServerError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-black text-gray-900 mb-2">
          تغییر رمز عبور
        </h1>
        <p className="text-gray-500 text-sm">
          رمز عبور جدید خود را برای حساب{" "}
          <span className="text-primary font-medium">{email}</span> وارد کنید.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AnimatePresence mode="wait">
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border-r-4 border-red-500 p-4 rounded-xl flex items-center gap-3 text-red-700 text-sm"
            >
              <FiAlertCircle className="shrink-0 text-lg" />
              {serverError}
            </motion.div>
          )}
        </AnimatePresence>

        <InputField
          label="رمز عبور جدید"
          type="password"
          error={errors.password?.message}
          register={register("password")}
        />

        <InputField
          label="تکرار رمز عبور"
          type="password"
          error={errors.confirmPassword?.message}
          register={register("confirmPassword")}
        />

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <FiLoader className="animate-spin text-xl" />
          ) : (
            "به‌روزرسانی رمز عبور"
          )}
        </motion.button>
      </form>
    </div>
  );
}

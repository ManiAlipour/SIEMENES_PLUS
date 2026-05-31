"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLoader,
  FiMail,
  FiArrowRight,
  FiAlertCircle,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";
import { z } from "zod";
import InputField from "./InputField";
import {
  getAuthErrorMessage,
  extractAuthErrorFromResponse,
} from "./authErrorUtils";

// تعریف Schema ساده برای ایمیل
const forgotPasswordSchema = z.object({
  email: z.string().email("لطفاً یک ایمیل معتبر وارد کنید"),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setLoading(true);
    setServerError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorMessage = await extractAuthErrorFromResponse(res);
        setServerError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      setIsSubmitted(true);
      toast.success("لینک بازیابی رمز عبور ارسال شد");
    } catch (err: unknown) {
      const errorMessage = getAuthErrorMessage(err);
      setServerError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 py-8"
      >
        <div className="flex justify-center">
          <div className="bg-green-100 p-4 rounded-full">
            <FiCheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">ایمیل ارسال شد!</h2>
          <p className="text-gray-600 leading-relaxed">
            اگر حسابی با این ایمیل وجود داشته باشد، دستورالعمل بازیابی رمز عبور
            را دریافت خواهید کرد.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-primary hover:underline font-bold py-2 px-4 transition-all"
        >
          <FiArrowRight />
          بازگشت به صفحه ورود
        </Link>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* نمایش خطای سرور */}
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3"
          >
            <FiAlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800 mb-1">خطا</p>
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
            <button type="button" onClick={() => setServerError(null)}>
              <FiX className="w-5 h-5 text-red-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2 text-center mb-4">
        <p className="text-gray-600 text-sm sm:text-base">
          ایمیلی که با آن ثبت‌نام کرده‌اید را وارد کنید تا لینک بازیابی ارسال
          شود.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <InputField
          label="ایمیل"
          type="email"
          register={register("email")}
          error={errors.email?.message}
        />
      </motion.div>

      <motion.button
        type="submit"
        disabled={loading}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: loading ? 1 : 1.01 }}
        whileTap={{ scale: loading ? 1 : 0.99 }}
        className={`
          w-full py-4 min-h-[52px] rounded-xl font-bold text-white text-lg
          transition-all duration-300 flex items-center justify-center gap-2
          ${loading ? "bg-gray-400" : "bg-primary shadow-lg hover:shadow-xl"}
        `}
      >
        {loading ? (
          <>
            <FiLoader className="w-5 h-5 animate-spin" />
            <span>در حال ارسال...</span>
          </>
        ) : (
          <>
            <FiMail className="w-5 h-5" />
            <span>ارسال لینک بازیابی</span>
          </>
        )}
      </motion.button>

      <div className="text-center mt-4">
        <Link
          href="/login"
          className="text-gray-500 hover:text-primary text-sm font-semibold transition-colors"
        >
          انصراف و بازگشت
        </Link>
      </div>
    </form>
  );
}

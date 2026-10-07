"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLoader,
  FiLogIn,
  FiUserPlus,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiRotateCw,
} from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import InputField from "./InputField";
import { z } from "zod";
import { getAuthSchema, type AuthMode } from "./authSchemas";
import {
  getAuthErrorMessage,
  extractAuthErrorFromResponse,
} from "./authErrorUtils";

interface AuthFormProps {
  mode: AuthMode;
}

const RESEND_COOLDOWN = 60;

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneFromQuery =
    mode === "verify" ? searchParams.get("phone") || "" : "";

  const schema = getAuthSchema(mode);
  type ModeFormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ModeFormData>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "verify" && phoneFromQuery
        ? ({ phoneNumber: phoneFromQuery, code: "" } as unknown as ModeFormData)
        : undefined,
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (mode === "verify" && phoneFromQuery) {
      setValue("phoneNumber" as never, phoneFromQuery as never);
    }
  }, [mode, phoneFromQuery, setValue]);

  // مدیریت تایمر شمارش معکوس ارسال مجدد پیامک
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mode === "verify" && countdown > 0) {
      setCanResend(false);
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [mode, countdown]);

  const handleResendOtp = async () => {
    if (!phoneFromQuery || !canResend || resending) return;
    setResending(true);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phoneFromQuery }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در ارسال مجدد");

      toast.success("کد جدید پیامک شد");
      setCountdown(RESEND_COOLDOWN);
      setCanResend(false);
    } catch (err: unknown) {
      toast.error(getAuthErrorMessage(err));
    } finally {
      setResending(false);
    }
  };

  const onSubmit = async (data: ModeFormData) => {
    setLoading(true);
    setServerError(null);

    if (mode === "verify" && !phoneFromQuery) {
      setServerError(
        "شماره موبایل یافت نشد. لطفاً مجدداً از فرم ثبت‌نام اقدام کنید.",
      );
      setLoading(false);
      return;
    }

    const submitData =
      mode === "verify" ? { ...data, phoneNumber: phoneFromQuery } : data;
    const url = `/api/auth/${mode === "register" ? "signup" : mode}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorMessage = await extractAuthErrorFromResponse(res);
        const lower = errorMessage.toLowerCase();
        const isNotVerified =
          lower.includes("not verified") || errorMessage.includes("تأیید نشده");

        const phone = (data as Record<string, unknown>)?.phoneNumber as
          | string
          | undefined;

        if (mode === "login" && isNotVerified && phone) {
          try {
            await fetch("/api/auth/resend-otp", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ phoneNumber: phone }),
            });
            toast.success("کد تأیید به شماره شما ارسال شد");
          } catch {
            toast.error("ارسال کد با خطا مواجه شد");
          }

          router.push(`/verify?phone=${encodeURIComponent(phone)}`);
          setLoading(false);
          return;
        }

        setServerError(errorMessage);
        toast.error(errorMessage, { duration: 5000 });
        setLoading(false);
        return;
      }

      const json = await res.json();
      toast.success(json.message || "عملیات موفقیت‌آمیز بود");

      if (mode === "register") {
        const phone = (data as { phoneNumber?: string }).phoneNumber;
        router.push(`/verify?phone=${encodeURIComponent(phone ?? "")}`);
      } else {
        window.dispatchEvent(new Event("auth-changed"));
        router.push("/");
        router.refresh();
      }
    } catch (err: unknown) {
      const errorMessage = getAuthErrorMessage(err);
      setServerError(errorMessage);
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start gap-3"
          >
            <FiAlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-red-800 mb-0.5">خطا</p>
              <p className="text-xs text-red-700 leading-relaxed wrap-break-word">
                {serverError}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setServerError(null)}
              className="shrink-0 text-red-400 hover:text-red-600 transition-colors"
              aria-label="بستن"
            >
              <FiX className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نام کاربر هنگام ثبت‌نام */}
      {mode === "register" && (
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
        >
          <InputField
            label="نام و نام خانوادگی"
            register={register("name" as never)}
            error={(errors as { name?: { message?: string } }).name?.message}
          />
        </motion.div>
      )}

      {/* فیلد شماره موبایل */}
      {mode !== "verify" && (
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: mode === "register" ? 0.1 : 0.05 }}
        >
          <InputField
            label="شماره تلفن همراه"
            type="tel"
            register={register("phoneNumber" as never)}
            error={
              (errors as { phoneNumber?: { message?: string } }).phoneNumber
                ?.message
            }
          />
        </motion.div>
      )}

      {/* نمایش شماره در حالت وریفای */}
      {mode === "verify" && phoneFromQuery && (
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between"
        >
          <div>
            <span className="block text-xs text-slate-500">
              ارسال کد به شماره:
            </span>
            <span
              className="font-semibold text-slate-800 text-sm font-mono tracking-wider"
              dir="ltr"
            >
              {phoneFromQuery}
            </span>
          </div>
          <Link
            href="/register"
            className="text-xs font-medium text-primary hover:underline"
          >
            تغییر شماره
          </Link>
        </motion.div>
      )}

      {mode === "verify" && !phoneFromQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800"
        >
          <span>اطلاعات شماره یافت نشد. </span>
          <Link href="/register" className="font-bold underline text-amber-900">
            بازگشت به ثبت‌نام
          </Link>
        </motion.div>
      )}

      {/* فیلد رمز عبور */}
      {mode !== "verify" && (
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: mode === "register" ? 0.15 : 0.1 }}
        >
          <InputField
            label="رمز عبور"
            type="password"
            register={register("password" as never)}
            error={
              (errors as { password?: { message?: string } }).password?.message
            }
          />
        </motion.div>
      )}

      {/* فیلد کد تأیید */}
      {mode === "verify" && phoneFromQuery && (
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <InputField
            label="کد تأیید ۶ رقمی"
            register={register("code" as never)}
            error={(errors as { code?: { message?: string } }).code?.message}
          />

          <div className="flex items-center justify-between text-xs pt-1">
            {canResend ? (
              <button
                type="button"
                disabled={resending}
                onClick={handleResendOtp}
                className="text-primary font-semibold hover:underline flex items-center gap-1.5"
              >
                <FiRotateCw
                  className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`}
                />
                <span>ارسال مجدد پیامک کد</span>
              </button>
            ) : (
              <span className="text-slate-400">
                ارسال مجدد تا{" "}
                <b className="font-mono text-slate-700">{countdown}</b> ثانیه
                دیگر
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* فراموشی رمز عبور */}
      {mode === "login" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-end"
        >
          <Link
            href="/forgot-password"
            className="text-xs sm:text-sm text-primary hover:underline font-medium"
          >
            رمز عبور را فراموش کرده‌اید؟
          </Link>
        </motion.div>
      )}

      {/* دکمه سابمیت */}
      <motion.button
        type="submit"
        disabled={loading}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: loading ? 1 : 1.01 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className={`
          w-full py-3 sm:py-3.5 rounded-xl font-bold text-white text-sm sm:text-base
          transition-all duration-200 flex items-center justify-center gap-2 shadow-md
          ${
            loading
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 shadow-primary/20 hover:shadow-lg active:scale-[0.99]"
          }
        `}
      >
        {loading ? (
          <>
            <FiLoader className="w-5 h-5 animate-spin" />
            <span>در حال ارسال...</span>
          </>
        ) : mode === "register" ? (
          <>
            <FiUserPlus className="w-5 h-5" />
            <span>ثبت‌نام در زیمنس‌پلاس</span>
          </>
        ) : mode === "login" ? (
          <>
            <FiLogIn className="w-5 h-5" />
            <span>ورود به حساب کاربری</span>
          </>
        ) : (
          <>
            <FiCheckCircle className="w-5 h-5" />
            <span>تأیید و ادامه</span>
          </>
        )}
      </motion.button>
    </form>
  );
}

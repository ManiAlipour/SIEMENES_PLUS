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

/**
 * Auth form for register, login, or verify. Uses react-hook-form + zod schema per mode.
 * On success: register → verify page; login/verify → home + auth-changed event.
 */
export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = mode === "verify" ? searchParams.get("email") || "" : "";

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
      mode === "verify" && emailFromQuery
        ? ({ email: emailFromQuery, code: "" } as ModeFormData)
        : undefined,
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "verify" && emailFromQuery) setValue("email", emailFromQuery as never);
  }, [mode, emailFromQuery, setValue]);

  const onSubmit = async (data: ModeFormData) => {
    setLoading(true);
    setServerError(null);

    if (mode === "verify" && !emailFromQuery) {
      setServerError("ایمیل یافت نشد. لطفاً از صفحه ثبت‌نام وارد شوید.");
      setLoading(false);
      return;
    }

    const submitData = mode === "verify" ? { ...data, email: emailFromQuery } : data;
    const url = `/api/auth/${mode === "register" ? "signup" : mode}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      let res: Response;
      try {
        res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch (fetchError: unknown) {
        clearTimeout(timeoutId);
        const err = fetchError as Error & { name?: string; message?: string };
        const isNetworkError =
          err?.name === "TypeError" ||
          err?.name === "NetworkError" ||
          err?.name === "AbortError" ||
          err?.message?.includes("fetch") ||
          err?.message?.includes("network") ||
          err?.message?.includes("Failed to fetch");
        const msg =
          err?.name === "AbortError"
            ? "درخواست بیش از حد طول کشید. لطفاً دوباره تلاش کنید."
            : "خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.";
        if (isNetworkError || err?.name === "AbortError") {
          setServerError(msg);
          toast.error(msg, { duration: 5000 });
          return;
        }
        const errorMsg = getAuthErrorMessage(fetchError);
        setServerError(errorMsg);
        toast.error(errorMsg, { duration: 5000 });
        return;
      }

      if (!res.ok) {
        const errorMessage = await extractAuthErrorFromResponse(res);
        setServerError(errorMessage);
        toast.error(errorMessage, { duration: 5000 });
        setLoading(false);
        return;
      }

      try {
        const json = await res.json();
        toast.success(json.message || "عملیات موفقیت‌آمیز بود");
        if (mode === "register") {
          const email = (data as { email?: string }).email;
          router.push(`/verify?email=${encodeURIComponent(email ?? "")}`);
        } else {
          window.dispatchEvent(new Event("auth-changed"));
          router.push("/");
        }
      } catch {
        toast.success("عملیات موفقیت‌آمیز بود");
        router.push(mode === "register" ? "/verify" : "/");
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3"
          >
            <FiAlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-800 mb-1">خطا</p>
              <p className="text-sm text-red-700 wrap-break-word">{serverError}</p>
            </div>
            <button
              type="button"
              onClick={() => setServerError(null)}
              className="shrink-0 text-red-400 hover:text-red-600 transition-colors"
              aria-label="بستن خطا"
            >
              <FiX className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {mode === "register" && (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <InputField
            label="نام کامل"
            register={register("name" as never)}
            error={(errors as { name?: { message?: string } }).name?.message}
          />
        </motion.div>
      )}

      {mode !== "verify" && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: mode === "register" ? 0.2 : 0.1 }}
        >
          <InputField
            label="ایمیل"
            type="email"
            register={register("email" as never)}
            error={errors.email?.message}
          />
        </motion.div>
      )}

      {mode === "verify" && emailFromQuery && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <label className="block mb-2 text-sm font-semibold text-gray-700">ایمیل</label>
          <div className="w-full px-4 py-3.5 rounded-xl bg-gray-100 border-2 border-gray-200 text-gray-600">
            {emailFromQuery}
          </div>
          <input type="hidden" {...register("email" as never)} value={emailFromQuery} />
        </motion.div>
      )}

      {mode === "verify" && !emailFromQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-4"
        >
          <p className="text-sm text-yellow-800">لطفاً از طریق صفحه ثبت‌نام وارد شوید.</p>
          <Link href="/register" className="text-sm text-yellow-700 underline mt-2 inline-block">
            بازگشت به صفحه ثبت‌نام
          </Link>
        </motion.div>
      )}

      {mode !== "verify" && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: mode === "register" ? 0.3 : 0.2 }}
        >
          <InputField
            label="رمز عبور"
            type="password"
            register={register("password" as never)}
            error={(errors as { password?: { message?: string } }).password?.message}
          />
        </motion.div>
      )}

      {mode === "verify" && emailFromQuery && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <InputField
            label="کد تأیید"
            register={register("code" as never)}
            error={(errors as { code?: { message?: string } }).code?.message}
          />
        </motion.div>
      )}

      {mode === "login" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between text-sm"
        >
          <label className="flex items-center gap-2.5 text-gray-600 cursor-pointer touch-manipulation">
            <input
              type="checkbox"
              className="w-5 h-5 sm:w-4 sm:h-4 rounded border-gray-300 cursor-pointer"
            />
            <span className="text-sm sm:text-base">مرا به خاطر بسپار</span>
          </label>
          <Link
            href="#"
            className="text-primary hover:underline font-semibold text-sm sm:text-base min-h-[44px] flex items-center touch-manipulation"
          >
            رمز عبور را فراموش کرده‌اید؟
          </Link>
        </motion.div>
      )}

      <motion.button
        type="submit"
        disabled={loading}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className={`
          w-full py-3.5 sm:py-4 min-h-[52px] rounded-xl font-bold text-white text-base sm:text-lg
          transition-all duration-300 flex items-center justify-center gap-2
          touch-manipulation active:scale-[0.98]
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl active:shadow-md"
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
            <span>ثبت‌نام</span>
          </>
        ) : mode === "login" ? (
          <>
            <FiLogIn className="w-5 h-5" />
            <span>ورود</span>
          </>
        ) : (
          <>
            <FiCheckCircle className="w-5 h-5" />
            <span>تأیید حساب</span>
          </>
        )}
      </motion.button>
    </form>
  );
}

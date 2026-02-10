"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "./InputField";
import toast from "react-hot-toast";
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

interface Props {
  mode: "register" | "login" | "verify";
}

export default function AuthForm({ mode }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailFromQuery =
    mode === "verify" ? searchParams.get("email") || "" : "";

  const schemaMap = {
    register: z.object({
      name: z.string().min(2, "نام حداقل باید ۲ کاراکتر باشد"),
      email: z.string().email("ایمیل معتبر نیست"),
      password: z.string().min(6, "حداقل ۶ کاراکتر"),
    }),
    login: z.object({
      email: z.string().email("ایمیل معتبر نیست"),
      password: z.string().min(6, "حداقل ۶ کاراکتر"),
    }),
    verify: z.object({
      email: z.string().email("ایمیل معتبر نیست"),
      code: z.string().length(6, "کد باید ۶ رقم باشد"),
    }),
  } as const;

  const schema = schemaMap[mode];
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "verify" && emailFromQuery
        ? { email: emailFromQuery, code: "" }
        : undefined,
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "verify" && emailFromQuery) {
      setValue("email", emailFromQuery);
    }
  }, [mode, emailFromQuery, setValue]);

  const translateError = (errorMessage: string): string => {
    const error = errorMessage.trim();

    // دیکشنری ترجمه خطاهای رایج
    const errorTranslations: Record<string, string> = {
      // خطاهای عمومی
      "all fields are required": "لطفاً تمام فیلدها را پر کنید",
      "email and password are required": "لطفاً ایمیل و رمز عبور را وارد کنید",
      "email and code are required": "لطفاً ایمیل و کد تأیید را وارد کنید",
      "signup failed": "ثبت‌نام با خطا مواجه شد. لطفاً دوباره تلاش کنید",
      "login failed": "ورود با خطا مواجه شد. لطفاً دوباره تلاش کنید",
      "verification failed":
        "تأیید حساب با خطا مواجه شد. لطفاً دوباره تلاش کنید",

      // خطاهای احراز هویت
      "user already exists":
        "این ایمیل قبلاً ثبت‌نام کرده است. لطفاً وارد شوید یا از صفحه فراموشی رمز عبور استفاده کنید",
      "user not found":
        "کاربری با این ایمیل یافت نشد. لطفاً اطلاعات را بررسی کنید",
      "account not verified":
        "حساب شما تأیید نشده است. لطفاً ابتدا ایمیل خود را تأیید کنید",
      "invalid credentials":
        "ایمیل یا رمز عبور اشتباه است. لطفاً دوباره تلاش کنید",
      "invalid verification code":
        "کد تأیید اشتباه است. لطفاً کد جدید درخواست کنید",
      "verification code expired":
        "کد تأیید منقضی شده است. لطفاً کد جدید درخواست کنید",
      "password incorrect": "رمز عبور اشتباه است",
      "email incorrect": "ایمیل اشتباه است",
      "email already registered": "این ایمیل قبلاً ثبت‌نام کرده است",
      "email not registered": "این ایمیل ثبت‌نام نکرده است",

      // خطاهای سرور
      "internal server error": "خطای داخلی سرور. لطفاً بعداً تلاش کنید",
      "server error": "خطای سرور. لطفاً بعداً تلاش کنید",
      unauthorized: "احراز هویت نامعتبر است. لطفاً دوباره وارد شوید",
      forbidden: "شما اجازه دسترسی به این بخش را ندارید",
      "not found": "درخواست یافت نشد",
      "bad request": "درخواست نامعتبر است. لطفاً اطلاعات را بررسی کنید",
      "too many requests":
        "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی صبر کنید",
      "service unavailable":
        "سرویس موقتاً در دسترس نیست. لطفاً بعداً تلاش کنید",

      // خطاهای شبکه و اتصال
      "network error":
        "خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید",
      "connection timeout": "اتصال به سرور برقرار نشد. لطفاً دوباره تلاش کنید",
      "failed to fetch": "خطا در برقراری ارتباط با سرور",
    };

    // جستجوی دقیق
    const lowerError = error.toLowerCase();
    if (errorTranslations[lowerError]) {
      return errorTranslations[lowerError];
    }

    // جستجوی جزئی (برای خطاهایی که ممکن است متن اضافه داشته باشند)
    for (const [key, value] of Object.entries(errorTranslations)) {
      if (lowerError.includes(key)) {
        return value;
      }
    }

    return error;
  };

  const getErrorMessage = (error: any): string => {
    if (typeof error === "string") {
      console.log("str :", error);
      return translateError(error);
    }

    if (error?.message) {
      console.log(error);
      return translateError(error.message);
    }

    return "خطایی رخ داد. لطفاً دوباره تلاش کنید.";
  };

  const extractServerError = async (res: Response): Promise<string> => {
    const contentType = res.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      const statusText =
        res.status === 401
          ? "احراز هویت نامعتبر است"
          : res.status === 403
            ? "دسترسی غیرمجاز"
            : res.status === 404
              ? "یافت نشد"
              : res.status === 500
                ? "خطای سرور"
                : res.statusText || "خطای نامشخص";

      return `خطای سرور (${res.status}): ${statusText}`;
    }

    try {
      const json = await res.json();

      let errorMessage = "";

      if (json.error) {
        errorMessage = translateError(json.error);
      } else if (json.message && !json.success) {
        errorMessage = translateError(json.message);
      } else if (json.errors) {
        if (Array.isArray(json.errors)) {
          errorMessage = json.errors
            .map((err: any) => translateError(String(err)))
            .join(", ");
        } else if (typeof json.errors === "object") {
          errorMessage = Object.values(json.errors)
            .map((err: any) => translateError(String(err)))
            .join(", ");
        } else {
          errorMessage = translateError(String(json.errors));
        }
      } else {
        if (res.status === 401) {
          errorMessage = "ایمیل یا رمز عبور اشتباه است";
        } else if (res.status === 403) {
          errorMessage = "شما اجازه دسترسی به این بخش را ندارید";
        } else if (res.status === 404) {
          errorMessage = "درخواست یافت نشد";
        } else if (res.status >= 500) {
          errorMessage = "خطای سرور. لطفاً بعداً تلاش کنید";
        } else {
          errorMessage = `خطای سرور: ${res.status}`;
        }
      }

      return errorMessage || "خطایی رخ داد. لطفاً دوباره تلاش کنید.";
    } catch (parseError) {
      const statusText =
        res.status === 401
          ? "احراز هویت نامعتبر است"
          : res.status === 403
            ? "دسترسی غیرمجاز"
            : res.status === 404
              ? "یافت نشد"
              : res.status === 500
                ? "خطای سرور"
                : res.statusText || "خطای نامشخص";

      return `خطای سرور (${res.status}): ${statusText}`;
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setServerError(null);

    if (mode === "verify" && !emailFromQuery) {
      setServerError("ایمیل یافت نشد. لطفاً از صفحه ثبت‌نام وارد شوید.");
      setLoading(false);
      return;
    }

    const submitData =
      mode === "verify" ? { ...data, email: emailFromQuery } : data;

    try {
      let res: Response;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        res = await fetch(
          `/api/auth/${mode === "register" ? "signup" : mode}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(submitData),
            signal: controller.signal,
          },
        );
        clearTimeout(timeoutId);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);

        const isNetworkError =
          fetchError.name === "TypeError" ||
          fetchError.name === "NetworkError" ||
          fetchError.name === "AbortError" ||
          fetchError.message?.includes("fetch") ||
          fetchError.message?.includes("network") ||
          fetchError.message?.includes("Failed to fetch");

        if (isNetworkError || fetchError.name === "AbortError") {
          const networkErrorMsg =
            fetchError.name === "AbortError"
              ? "درخواست بیش از حد طول کشید. لطفاً دوباره تلاش کنید."
              : "خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.";

          setServerError(networkErrorMsg);
          toast.error(networkErrorMsg, { duration: 5000 });
          return;
        }

        const errorMsg = getErrorMessage(fetchError);
        setServerError(errorMsg);
        toast.error(errorMsg, { duration: 5000 });
        return;
      }

      if (!res.ok) {
        const errorMessage = await extractServerError(res);
        setServerError(errorMessage);
        toast.error(errorMessage, { duration: 5000 });
        return;
      }

      try {
        const json = await res.json();
        toast.success(json.message || "عملیات موفقیت‌آمیز بود");

        if (mode === "register") {
          const email = (data as any).email;
          router.push(`/verify?email=${encodeURIComponent(email)}`);
        } else if (mode === "login") {
          window.dispatchEvent(new Event("auth-changed"));
          router.push("/");
        } else if (mode === "verify") {
          window.dispatchEvent(new Event("auth-changed"));
          router.push("/");
        }
      } catch (parseError) {
        toast.success("عملیات موفقیت‌آمیز بود");
        if (mode === "register") {
          router.push("/verify");
        } else {
          window.dispatchEvent(new Event("auth-changed"));
          router.push("/");
        }
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
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
              <p className="text-sm text-red-700 break-words">{serverError}</p>
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
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <InputField
            label="نام کامل"
            register={register("name")}
            error={(errors as any).name?.message}
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
            register={register("email")}
            error={errors.email?.message}
          />
        </motion.div>
      )}

      {/* نمایش ایمیل به صورت فقط خواندنی برای verify */}
      {mode === "verify" && emailFromQuery && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            ایمیل
          </label>
          <div className="w-full px-4 py-3.5 rounded-xl bg-gray-100 border-2 border-gray-200 text-gray-600">
            {emailFromQuery}
          </div>
          <input type="hidden" {...register("email")} value={emailFromQuery} />
        </motion.div>
      )}

      {/* اگر email در query parameter نباشد */}
      {mode === "verify" && !emailFromQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-4"
        >
          <p className="text-sm text-yellow-800">
            لطفاً از طریق صفحه ثبت‌نام وارد شوید.
          </p>
          <Link
            href="/register"
            className="text-sm text-yellow-700 underline mt-2 inline-block"
          >
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
            register={register("password")}
            error={(errors as any).password?.message}
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
            register={register("code")}
            error={(errors as any).code?.message}
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
          transition-all duration-300
          flex items-center justify-center gap-2
          touch-manipulation active:scale-[0.98]
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl active:shadow-md"
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

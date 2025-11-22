"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "./InputField";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiLoader, FiLogIn, FiUserPlus, FiCheckCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  mode: "register" | "login" | "verify";
}

export default function AuthForm({ mode }: Props) {
  const router = useRouter();
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
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/auth/${mode === "register" ? "signup" : mode}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "خطا در ارتباط با سرور");

      toast.success(json.message || "عملیات موفقیت‌آمیز بود");

      if (mode === "register") {
        router.push("/verify");
      } else if (mode === "login") {
        window.dispatchEvent(new Event("auth-changed"));
        router.push("/");
      } else if (mode === "verify") {
        window.dispatchEvent(new Event("auth-changed"));
        router.push("/");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

      {mode === "verify" && (
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
          <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300"
            />
            <span>مرا به خاطر بسپار</span>
          </label>
          <Link href="#" className="text-primary hover:underline font-semibold">
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
          w-full py-4 rounded-xl font-bold text-white
          transition-all duration-300
          flex items-center justify-center gap-2
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl"
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

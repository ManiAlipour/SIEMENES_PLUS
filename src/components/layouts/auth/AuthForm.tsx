"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "./InputField";
import toast from "react-hot-toast";

interface Props {
  mode: "register" | "login" | "verify";
}

export default function AuthForm({ mode }: Props) {
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

      if (mode === "register") window.location.href = "/verify";
      else if (mode === "login") window.location.href = "/";
      else if (mode === "verify") window.location.href = "/";
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {mode === "register" && (
        <InputField
          label="نام کامل"
          register={register("name")}
          error={(errors as any).name?.message}
        />
      )}

      <InputField
        label="ایمیل"
        type="email"
        register={register("email")}
        error={errors.email?.message}
      />
      {mode !== "verify" && (
        <InputField
          label="رمز عبور"
          type="password"
          register={register("password")}
          error={(errors as any).password?.message}
        />
      )}
      {mode === "verify" && (
        <InputField
          label="کد تأیید"
          register={register("code")}
          error={(errors as any).code?.message}
        />
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2.5 rounded-md font-medium text-[15px] tracking-wide transition-all duration-200 ease-out
          ${
            loading
              ? "bg-teal-600/40 cursor-not-allowed"
              : "bg-gradient-to-r from-teal-500 to-cyan-500 hover:opacity-90 shadow-[0_0_15px_rgba(14,165,233,0.35)]"
          }`}
      >
        {loading ? (
          <span className="inline-flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/40 border-t-transparent animate-spin rounded-full"></span>
            <span>در حال ارسال...</span>
          </span>
        ) : mode === "register" ? (
          "ثبت‌نام"
        ) : mode === "login" ? (
          "ورود"
        ) : (
          "تأیید حساب"
        )}
      </button>
    </form>
  );
}

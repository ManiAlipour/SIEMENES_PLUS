"use client";
import { useFormik } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import { MdSend } from "react-icons/md";
import * as Yup from "yup";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ContactForm() {
  // Localized error messages in Farsi
  const errorMessages: Record<string, string> = {
    required: "این فیلد الزامی است.",
    invalidEmail: "لطفاً یک ایمیل معتبر وارد کنید.",
    min: "تعداد حروف وارد شده کافی نیست.",
    max: "تعداد حروف وارد شده بیش از حد مجاز است.",
  };

  const {
    handleSubmit,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    values,
    resetForm,
    setSubmitting,
  } = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      title: "",
      message: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("نام الزامی است."),
      lastName: Yup.string().required("نام خانوادگی الزامی است."),
      email: Yup.string()
        .email("لطفاً یک ایمیل معتبر وارد کنید.")
        .required("ایمیل الزامی است."),
      title: Yup.string().required("موضوع پیام الزامی است."),
      message: Yup.string().required("متن پیام الزامی است."),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        console.log("data : ", data);

        if (res.ok && data.success) {
          toast.success("پیام شما با موفقیت ارسال شد.", {
            position: "top-center",
            style: {
              direction: "rtl",
              background: "linear-gradient(to right, #22d3ee, #14b8a6)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
            },
            iconTheme: {
              primary: "#14b8a6",
              secondary: "#fff",
            },
            duration: 5000,
          });
          resetForm();
        } else {
          if (data?.error) {
            const isFarsi = /[\u0600-\u06FF]/.test(data.error);
            toast.error(
              isFarsi ? data.error : "خطا در ثبت پیام. لطفا دوباره سعی کنید.",
              {
                position: "top-center",
                style: {
                  direction: "rtl",
                  background: "linear-gradient(to right, #ef4444, #ec4899)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 16,
                },
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
                duration: 5000,
              }
            );
          } else {
            toast.error("خطا در ثبت پیام. لطفا دوباره سعی کنید.", {
              position: "top-center",
              style: {
                direction: "rtl",
                background: "linear-gradient(to right, #ef4444, #ec4899)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
              },
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
              duration: 5000,
            });
          }
        }
      } catch (err) {
        console.log(err);
        toast.error("خطا در ارتباط با سرور. لطفا بعدا تلاش کنید.", {
          position: "top-center",
          style: {
            direction: "rtl",
            background: "linear-gradient(to right, #ef4444, #ec4899)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 16,
          },
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
          duration: 5000,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Helper to get proper localized error message for a field
  function getError(field: string) {
    // If the error is in English, convert it to the Farsi equivalent.
    // Recognize common Yup error patterns.
    const error = touched[field] && errors[field] ? errors[field] : "";
    if (!error) return "";
    if (error.toLowerCase().includes("required")) {
      return "این فیلد الزامی است.";
    }
    if (
      error.toLowerCase().includes("valid email") ||
      error.toLowerCase().includes("must be a valid email")
    ) {
      return "لطفاً یک ایمیل معتبر وارد کنید.";
    }
    // Otherwise, display the error as is (assume it's already localized)
    return error;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="relative"
      >
        {/* Decorative glow behind the form */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />

        <form
          onSubmit={handleSubmit}
          noValidate
          className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-700 shadow-2xl"
        >
          <h3 className="text-2xl font-bold text-white mb-6">
            ارسال پیام مستقیم
          </h3>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <InputField
                label="نام"
                placeholder="علی"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={getError("firstName")}
              />
              <InputField
                label="نام خانوادگی"
                placeholder="محمدی"
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={getError("lastName")}
              />
            </div>

            <InputField
              label="ایمیل"
              placeholder="example@mail.com"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getError("email")}
            />
            <InputField
              label="موضوع پیام"
              placeholder="مشاوره فنی..."
              name="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getError("title")}
            />

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                متن پیام
              </label>
              <textarea
                rows={4}
                name="message"
                className={`w-full bg-slate-800/50 border ${
                  getError("message")
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-700 focus:ring-cyan-500"
                } rounded-xl px-4 py-3 text-white focus:border-transparent outline-none transition-all resize-none placeholder-slate-600`}
                placeholder="درخواست خود را اینجا بنویسید..."
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <AnimatePresence>
                {getError("message") && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-red-500 mt-1 px-1"
                    dir="rtl"
                  >
                    {getError("message")}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span>ارسال پیام</span>
              <MdSend className="text-xl rtl:rotate-180" />
            </motion.button>
          </div>
        </form>
      </motion.div>
    </>
  );
}

import { InputHTMLAttributes } from "react";

type InputFieldProps = {
  label: string;
  placeholder: string;
  type?: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

function InputField({
  label,
  placeholder,
  type = "text",
  error,
  ...props
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-400 mb-2">
        {label}
      </label>
      <input
        type={type}
        className={`w-full bg-slate-800/50 border ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-slate-700 focus:ring-cyan-500"
        } rounded-xl px-4 py-3 text-white focus:border-transparent outline-none transition-all placeholder-slate-600`}
        placeholder={placeholder}
        {...props}
      />
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs text-red-500 mt-1 px-1"
            dir="rtl"
          >
            {/* Always show the error in Farsi if it's a known error, otherwise show the error as is */}
            {
              error === "This field is required." ||
              error.toLowerCase().includes("required")
                ? "این فیلد الزامی است."
                : error === "Invalid email" ||
                  error.toLowerCase().includes("valid email")
                ? "لطفاً یک ایمیل معتبر وارد کنید."
                : error // If it's already localized, just show as is
            }
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

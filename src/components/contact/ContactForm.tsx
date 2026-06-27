"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    title: "",
    message: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("نام خود را وارد کنید"),
    lastName: Yup.string().required("نام خانوادگی خود را وارد کنید"),
    email: Yup.string()
      .email("ایمیل معتبر نیست")
      .required("ایمیل را وارد کنید"),
    title: Yup.string().required("عنوان پیام را وارد کنید"),
    message: Yup.string().required("پیام را وارد کنید"),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm }: { resetForm: () => void },
  ) => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setSuccessMsg("پیام شما با موفقیت ارسال شد.");
        resetForm();
      } else {
        setErrorMsg("ارسال پیام با خطا مواجه شد.");
      }
    } catch {
      setErrorMsg("خطا در ارتباط با سرور.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
        فرم تماس
      </h2>

      {successMsg && (
        <div className="mb-4 text-green-600 border border-green-200 bg-green-50 rounded-xl px-4 py-3 text-sm">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 text-red-600 border border-red-200 bg-red-50 rounded-xl px-4 py-3 text-sm">
          {errorMsg}
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ touched, errors }) => (
          <Form className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">نام</label>
                <Field
                  name="firstName"
                  className={`w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none ${
                    touched.firstName && errors.firstName
                      ? "border-red-400"
                      : ""
                  }`}
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="text-xs text-red-500 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  نام خانوادگی
                </label>
                <Field
                  name="lastName"
                  className={`w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none ${
                    touched.lastName && errors.lastName ? "border-red-400" : ""
                  }`}
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="text-xs text-red-500 mt-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">ایمیل</label>
              <Field
                name="email"
                type="email"
                className={`w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none ${
                  touched.email && errors.email ? "border-red-400" : ""
                }`}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                عنوان پیام
              </label>
              <Field
                name="title"
                className={`w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none ${
                  touched.title && errors.title ? "border-red-400" : ""
                }`}
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                پیام شما
              </label>
              <Field
                as="textarea"
                name="message"
                rows={6}
                className={`w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none resize-none ${
                  touched.message && errors.message ? "border-red-400" : ""
                }`}
              />
              <ErrorMessage
                name="message"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-primary/80 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                "در حال ارسال..."
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  ارسال پیام
                </>
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

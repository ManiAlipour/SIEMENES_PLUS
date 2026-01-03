"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, Clock } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement contact form submission
    toast.success("پیام شما با موفقیت ارسال شد!");
    setFormData({ name: "", email: "", message: "" });
    setLoading(false);
  };

  const contactInfo = [
    {
      Icon: Phone,
      label: "تلفن",
      value: "09199883772",
      color: "from-blue-500 to-blue-600",
    },
    {
      Icon: Mail,
      label: "ایمیل",
      value: "siemensplus8020@gmail.com",
      color: "from-purple-500 to-purple-600",
    },
    {
      Icon: MapPin,
      label: "آدرس",
      value:
        "قزوین، شهر صنعتی البرز، خیابان زکریای رازی، جنب شرکت مهرام، پلاک ۲۰",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      Icon: Clock,
      label: "ساعات کاری",
      value: "۹ صبح تا ۵ عصر (شنبه تا چهارشنبه)",
      color: "from-amber-500 to-amber-600",
    },
  ];

  return (
    <main className="min-h-screen font-vazir bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-4xl mx-auto px-4"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              تماس با ما
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-full mx-auto mb-6" />
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            تیم فنی و مهندسی زیمنس پلاس همیشه آماده پاسخ‌گویی به پرسش‌ها و
            همکاری‌های صنعتی شماست.
          </p>
        </motion.div>
      </section>

      {/* Contact Info & Form */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-4"
          >
            {contactInfo.map((info, index) => {
              const Icon = info.Icon;
              return (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-4 rounded-xl bg-gradient-to-br ${info.color} shadow-lg flex-shrink-0`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">
                        {info.label}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {info.value}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Contact Form */}
          <ContactUs />
        </div>
      </section>

      {/* Map Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            دفتر مرکزی Siemens Plus
          </h3>
          <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d284.57077922117645!2d50.088454345482525!3d36.20180397222579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1zICAg2YLYstmI24zZhtiMINi02YfYsSDYtdmG2LnYqtuMINin2YTYqNix2LLYjCDYrtuM2KfYqNin2YYg2LLaqdix24zYp9uMINix2KfYstuM2Iwg2KzZhtioINi02LHaqdiqINmF2YfYsdin2YXYjCDZvtmE2KfaqSDbstuw!5e0!3m2!1sfa!2s!4v1761992148931!5m2!1sfa!2s"
              className="w-full h-[400px] md:h-[500px]"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </motion.div>
      </section>
    </main>
  );
}

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ContactUs = () => {
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

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setSuccessMsg("پیام شما با موفقیت ارسال شد.");
        resetForm();
      } else {
        setErrorMsg("ارسال پیام با خطا مواجه شد. لطفا مجددا تلاش کنید.");
      }
    } catch (error) {
      setErrorMsg("خطا در ارتباط با سرور. لطفا بعدا تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl"
    >
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  نام
                </label>
                <Field
                  type="text"
                  name="firstName"
                  required
                  placeholder="نام شما..."
                  className={`w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none${
                    touched.firstName && errors.firstName
                      ? " border-red-400"
                      : ""
                  }`}
                />
                <ErrorMessage name="firstName">
                  {(msg) => (
                    <div className="text-xs text-red-500 mt-1">{msg}</div>
                  )}
                </ErrorMessage>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  نام خانوادگی
                </label>
                <Field
                  type="text"
                  name="lastName"
                  required
                  placeholder="نام خانوادگی شما..."
                  className={`w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none${
                    touched.lastName && errors.lastName ? " border-red-400" : ""
                  }`}
                />
                <ErrorMessage name="lastName">
                  {(msg) => (
                    <div className="text-xs text-red-500 mt-1">{msg}</div>
                  )}
                </ErrorMessage>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ایمیل
              </label>
              <Field
                type="email"
                name="email"
                required
                placeholder="ایمیل شما..."
                className={`w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none${
                  touched.email && errors.email ? " border-red-400" : ""
                }`}
              />
              <ErrorMessage name="email">
                {(msg) => (
                  <div className="text-xs text-red-500 mt-1">{msg}</div>
                )}
              </ErrorMessage>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                عنوان پیام
              </label>
              <Field
                type="text"
                name="title"
                required
                placeholder="عنوان پیام..."
                className={`w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none${
                  touched.title && errors.title ? " border-red-400" : ""
                }`}
              />
              <ErrorMessage name="title">
                {(msg) => (
                  <div className="text-xs text-red-500 mt-1">{msg}</div>
                )}
              </ErrorMessage>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                پیام شما
              </label>
              <Field
                as="textarea"
                name="message"
                rows={6}
                required
                placeholder="پیام خود را بنویسید..."
                className={`w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none${
                  touched.message && errors.message ? " border-red-400" : ""
                }`}
              />
              <ErrorMessage name="message">
                {(msg) => (
                  <div className="text-xs text-red-500 mt-1">{msg}</div>
                )}
              </ErrorMessage>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-primary/80 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                "در حال ارسال..."
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  ارسال پیام
                </>
              )}
            </motion.button>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

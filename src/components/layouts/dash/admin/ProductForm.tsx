"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { FiTrash2, FiCamera } from "react-icons/fi";
import { useScrollLock } from "iso-hooks";
import { IoClose } from "react-icons/io5";

interface Category {
  name: string;
  slug: string;
}

interface ProductFormProps {
  mode: "create" | "edit";
  initialValues: any;
  onSubmit: (values: any, helpers: any) => Promise<void>;
  submitText: string;
  onClose: () => void;
}

const ProductSchema = Yup.object().shape({
  name: Yup.string().required("نام محصول الزامی است"),
  slug: Yup.string().required("شناسه لازم است").lowercase(),
  category: Yup.string().required("انتخاب دسته‌بندی الزامی است"),
  specifications: Yup.array().of(
    Yup.object().shape({
      key: Yup.string().required("کلید لازم است"),
      value: Yup.string().required("مقدار لازم است"),
    }),
  ),
});

const InputField = ({
  label,
  hint,
  error,
  required,
  children,
}: {
  label?: string;
  hint?: string;
  error?: string | false | undefined;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    {label && (
      <div className="flex items-center gap-1">
        <label className="text-sm font-semibold text-slate-800">{label}</label>
        {required && <span className="text-red-500">*</span>}
      </div>
    )}

    {children}

    {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-2xl border border-slate-200 bg-white/80 p-4 md:p-5 shadow-sm">
    <div className="mb-4">
      <h3 className="text-sm md:text-base font-bold text-slate-800">{title}</h3>
      {description && (
        <p className="mt-1 text-xs md:text-sm text-slate-500">{description}</p>
      )}
    </div>
    <div className="space-y-4">{children}</div>
  </section>
);

export default function ProductForm({
  mode,
  initialValues,
  onSubmit,
  submitText,
  onClose,
}: ProductFormProps) {
  const [preview, setPreview] = useState<string | null>(
    initialValues.imageUrl || null,
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const { lock, unlock } = useScrollLock();

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) setCategories(data.data);
      })
      .catch(console.error);
  }, []);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    lock();
    return () => unlock();
  }, [lock, unlock]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/55 backdrop-blur-md p-3 md:p-6 animate-fadeIn">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-white/30 bg-slate-50 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 bg-white/90 px-5 py-4 md:px-6">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900">
              {mode === "create" ? "افزودن محصول جدید" : "ویرایش محصول"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              اطلاعات اصلی محصول، سئو، تصویر و مشخصات فنی را تکمیل کنید.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="بستن"
          >
            <IoClose size={22} />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={ProductSchema}
          enableReinitialize
          onSubmit={onSubmit}
        >
          {({ errors, touched, setFieldValue, values, isSubmitting }) => (
            <Form className="max-h-[88vh] overflow-y-auto">
              <div className="space-y-5 p-4 md:p-6">
                <Section
                  title="اطلاعات اصلی"
                  description="اطلاعات پایه محصول برای نمایش در سایت و مدیریت پنل."
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InputField
                      label="نام محصول"
                      required
                      error={touched.name && (errors.name as string)}
                      hint="نامی که در صفحه محصول نمایش داده می‌شود."
                    >
                      <Field
                        name="name"
                        onChange={(e: any) => {
                          const value = e.target.value;
                          setFieldValue("name", value);

                          if (mode === "create") {
                            setFieldValue(
                              "slug",
                              value.trim().replace(/\s+/g, "-").toLowerCase(),
                            );
                          }
                        }}
                        className="input"
                        placeholder="مثلاً: درایو 6SN1123-1AA00-0BA1 زیمنس"
                      />
                    </InputField>

                    <InputField
                      label="شناسه"
                      required
                      error={touched.slug && (errors.slug as string)}
                      hint="برای آدرس صفحه محصول استفاده می‌شود."
                    >
                      <Field
                        name="slug"
                        className="input ltr-input"
                        placeholder="product-slug"
                      />
                    </InputField>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <InputField label="برند" hint="مثلاً: زیمنس">
                      <Field
                        name="brand"
                        className="input"
                        placeholder="زیمنس"
                      />
                    </InputField>

                    <InputField
                      label="دسته‌بندی"
                      required
                      error={touched.category && (errors.category as string)}
                    >
                      <Field as="select" name="category" className="input">
                        <option value="">انتخاب دسته‌بندی...</option>
                        {categories.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </Field>
                    </InputField>

                    <InputField
                      label="شماره مدل"
                      hint="کد فنی یا مدل دقیق محصول."
                    >
                      <Field
                        name="modelNumber"
                        className="input ltr-input"
                        placeholder="6SN1123-1AA00-0BA1"
                      />
                    </InputField>
                  </div>

                  <InputField
                    label="توضیحات"
                    hint="توضیح کوتاه و کاربردی برای صفحه محصول."
                  >
                    <Field
                      as="textarea"
                      name="description"
                      className="input min-h-[120px] resize-y"
                      placeholder="توضیح کامل‌تری درباره محصول، کاربرد، ویژگی‌ها و مزایا بنویسید."
                    />
                  </InputField>
                </Section>

                <Section
                  title="تنظیمات سئو"
                  description="این بخش برای عنوان و توضیحات متای صفحه محصول استفاده می‌شود."
                >
                  <InputField
                    label="متا تایتل"
                    hint="بهتر است کوتاه، دقیق و شامل نام محصول یا مدل باشد."
                  >
                    <Field
                      name="metaTitle"
                      className="input"
                      placeholder="مثلاً: درایو 6SN1123-1AA00-0BA1 زیمنس"
                    />
                  </InputField>

                  <InputField
                    label="متا دیسکریپشن"
                    hint="ترجیحاً بین 140 تا 160 کاراکتر و شامل خرید، مشخصات و مدل محصول."
                  >
                    <Field
                      as="textarea"
                      name="metaDescription"
                      className="input min-h-[110px] resize-y"
                      placeholder="مثلاً: خرید و مشخصات فنی درایو زیمنس مدل 6SN1123-1AA00-0BA1، مناسب کاربردهای صنعتی و سیستم‌های CNC."
                    />
                  </InputField>
                </Section>

                <Section
                  title="تصویر محصول"
                  description="برای نمایش بهتر در صفحه محصول و لیست محصولات، یک تصویر مناسب انتخاب کنید."
                >
                  <div className="space-y-3">
                    <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-cyan-300 bg-cyan-50/50 p-4 md:p-6">
                      {!preview ? (
                        <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-3 text-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
                            <FiCamera size={28} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              برای انتخاب تصویر کلیک کنید
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              فرمت‌های رایج تصویر مانند JPG، PNG یا WEBP
                            </p>
                          </div>

                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setFieldValue("image", file);
                                setPreview(URL.createObjectURL(file));
                              }
                            }}
                          />
                        </label>
                      ) : (
                        <div className="space-y-3">
                          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
                            <Image
                              src={preview}
                              alt="preview"
                              width={1200}
                              height={700}
                              className="h-auto max-h-[360px] w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setPreview(null);
                                setFieldValue("image", null);
                              }}
                              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:bg-red-600"
                              aria-label="حذف تصویر"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>

                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                            <FiCamera size={16} />
                            تغییر تصویر
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setFieldValue("image", file);
                                  setPreview(URL.createObjectURL(file));
                                }
                              }}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </Section>

                <Section
                  title="مشخصات فنی"
                  description="هر مشخصه را به صورت کلید و مقدار وارد کنید؛ مثل ولتاژ، توان، جریان یا خانواده محصول."
                >
                  <FieldArray name="specifications">
                    {({ push, remove }) => (
                      <div className="space-y-3">
                        {values.specifications.map((_: any, idx: number) => (
                          <div
                            key={idx}
                            className="grid grid-cols-1 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_1fr_auto]"
                          >
                            <Field
                              name={`specifications[${idx}].key`}
                              placeholder="کلید مشخصه"
                              className="input"
                            />
                            <Field
                              name={`specifications[${idx}].value`}
                              placeholder="مقدار مشخصه"
                              className="input"
                            />
                            <button
                              type="button"
                              onClick={() => remove(idx)}
                              className="inline-flex h-11 items-center justify-center rounded-xl border border-red-200 px-4 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                              disabled={values.specifications.length === 1}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => push({ key: "", value: "" })}
                          className="inline-flex items-center justify-center rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-700"
                        >
                          افزودن مشخصه
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </Section>

                <Section
                  title="تنظیمات نمایش"
                  description="مشخص کنید این محصول در بخش‌های ویژه سایت نمایش داده شود یا نه."
                >
                  <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        محصول ویژه
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        در صورت فعال بودن، محصول در بخش‌های منتخب بیشتر نمایش
                        داده می‌شود.
                      </p>
                    </div>

                    <Field
                      type="checkbox"
                      name="isFeatured"
                      className="h-5 w-5 accent-cyan-600"
                    />
                  </label>
                </Section>
              </div>

              <div className="sticky bottom-0 flex flex-col gap-3 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur md:flex-row md:items-center md:justify-end md:px-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 md:w-auto"
                >
                  انصراف
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-700 px-5 py-3 text-sm font-medium text-white shadow-md transition hover:from-cyan-600 hover:to-cyan-800 disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
                >
                  {isSubmitting ? "در حال ذخیره..." : submitText}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.9rem;
          border: 1px solid #cbd5e1;
          background: rgba(255, 255, 255, 0.95);
          padding: 0.8rem 0.95rem;
          font-size: 0.95rem;
          color: #0f172a;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .input::placeholder {
          color: #94a3b8;
        }

        .input:focus {
          outline: none;
          border-color: #06b6d4;
          box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.14);
          background: #ffffff;
        }

        .ltr-input {
          direction: ltr;
          text-align: left;
        }
      `}</style>
    </div>,
    document.body,
  );
}

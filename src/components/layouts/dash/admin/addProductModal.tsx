"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray, FormikErrors } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import toast from "react-hot-toast";
import { FiX, FiTrash2, FiCamera } from "react-icons/fi";

// ✅ Validation Schema for product form
const ProductSchema = Yup.object().shape({
  name: Yup.string().required("نام محصول الزامی است"),
  slug: Yup.string().required("شناسه لازم است").lowercase(),
  brand: Yup.string().nullable(),
  category: Yup.string().required("انتخاب دسته‌بندی الزامی است"),
  modelNumber: Yup.string().nullable(),
  description: Yup.string().nullable(),
  specifications: Yup.array().of(
    Yup.object().shape({
      key: Yup.string().required("کلید لازم است"),
      value: Yup.string().required("مقدار لازم است"),
    })
  ),
  image: Yup.mixed().nullable(),
  isFeatured: Yup.boolean(),
});

// ✅ Small wrapper component for consistent input and label styling
const InputField = ({
  label,
  error,
  children,
}: {
  label?: string;
  error?: string | false | undefined;
  children: React.ReactNode;
}) => (
  <div className="space-y-1">
    {label && (
      <label className="text-sm font-medium text-slate-700">{label}</label>
    )}
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// ✅ Main Modal component
export default function AddProductModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: () => void;
}) {
  const [preview, setPreview] = useState<string>("");
  const [categories, setCategories] = useState<
    { name: string; slug: string }[]
  >([]);

  // ✅ Fetch categories once on mount
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) setCategories(data.data);
      })
      .catch((err) => console.error("خطا در دریافت کتگوری‌ها:", err));
  }, []);

  // ✅ Submit logic
  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      const fd = new FormData();

      // Convert specifications array to object
      const specsObj: Record<string, string> = {};
      values.specifications.forEach((s: any) => {
        specsObj[s.key] = s.value;
      });
      fd.append("specifications", JSON.stringify(specsObj));

      // Append all other fields
      Object.entries(values).forEach(([key, val]) => {
        if (key !== "specifications" && key !== "image") {
          fd.append(key, String(val));
        }
      });
      if (values.image) fd.append("image", values.image);

      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: fd,
      });

      if (res.ok) {
        // Logging admin action after success
        await fetch("/api/admin/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: "مانی ایمانی", // TODO: Replace with real session
            action: "ADD_PRODUCT",
            entity: "product",
            entityName: values.name,
          }),
        });

        toast.success("محصول با موفقیت ثبت شد ✅", {
          className: "z-50 font-vazirmatn",
          position: "top-center",
        });

        resetForm();
        onAdd();
        onClose();
      } else {
        toast.error("خطا در ذخیره‌سازی محصول!", {
          className: "z-50 font-vazirmatn",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("خطا در ارتباط با سرور", {
        className: "z-50 font-vazirmatn",
      });
    }
  };

  // ✅ Memory cleanup for preview URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // ✅ Main JSX
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xl animate-fadeIn"
    >
      <div className="w-[90%] md:w-[650px] rounded-2xl bg-white/80 backdrop-blur-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-slate-200 p-6 animate-scaleIn overflow-y-auto max-h-[90vh]">
        {/* 🩶 Header */}
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-200/60 bg-gradient-to-r from-white/80 via-white/60 to-white/80 backdrop-blur-lg">
          <h2 className="text-xl font-bold text-slate-800 font-vazirmatn">
            افزودن محصول جدید
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-cyan-600 hover:text-cyan-800 hover:bg-slate-100 transition-all"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* ⚙️ Form */}
        <Formik
          initialValues={{
            name: "",
            slug: "",
            brand: "",
            category: "",
            modelNumber: "",
            description: "",
            specifications: [{ key: "", value: "" }],
            image: null,
            isFeatured: false,
          }}
          validationSchema={ProductSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form className="space-y-5 font-vazirmatn">
              {/* === Basic Info === */}
              <InputField label="نام محصول" error={touched.name && errors.name}>
                <Field
                  name="name"
                  onChange={(e: any) => {
                    const value = e.target.value;
                    setFieldValue("name", value);
                    setFieldValue(
                      "slug",
                      value.replace(/\s+/g, "-").toLowerCase()
                    );
                  }}
                  className="bg-white/70 border border-slate-300 rounded-xl w-full px-3 py-2 focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.3)] transition-all"
                  placeholder="مثلاً: اینورتر 5.5 کیلووات"
                />
              </InputField>

              <InputField
                label="شناسه (slug)"
                error={touched.slug && errors.slug}
              >
                <Field
                  name="slug"
                  className="bg-white/70 border border-slate-300 rounded-xl w-full px-3 py-2 focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.3)] transition-all"
                />
              </InputField>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="برند">
                  <Field
                    name="brand"
                    className="bg-white/70 border border-slate-300 rounded-xl w-full px-3 py-2"
                  />
                </InputField>

                <InputField
                  label="دسته‌بندی"
                  error={touched.category && errors.category}
                >
                  <Field
                    as="select"
                    name="category"
                    className="bg-white/70 border border-slate-300 rounded-xl w-full px-3 py-2 appearance-none focus:border-cyan-500"
                  >
                    <option value="">انتخاب کنید...</option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </Field>
                </InputField>

                <InputField label="شماره مدل">
                  <Field
                    name="modelNumber"
                    className="bg-white/70 border border-slate-300 rounded-xl w-full px-3 py-2"
                  />
                </InputField>
              </div>

              {/* === Description === */}
              <InputField label="توضیحات">
                <Field
                  as="textarea"
                  name="description"
                  className="bg-white/70 border border-slate-300 rounded-xl h-24 resize-none w-full px-3 py-2"
                />
              </InputField>

              {/* === Image Upload === */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  تصویر محصول
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      setFieldValue("image", file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                  className="relative group border-2 border-dashed border-cyan-400/40 rounded-xl p-6 bg-white/40 backdrop-blur-md flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500/60 transition-all"
                >
                  {!preview && (
                    <>
                      <FiCamera className="text-cyan-500 mb-2" size={36} />
                      <p className="text-sm text-slate-600">
                        برای انتخاب یا کشیدن تصویر کلیک کنید
                      </p>
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
                    </>
                  )}
                  {preview && (
                    <div className="relative w-full">
                      <Image
                        src={preview}
                        alt="preview"
                        width={500}
                        height={300}
                        className="rounded-xl border border-slate-200 shadow-lg animate-fadeIn object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue("image", null);
                          setPreview("");
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-full text-white hover:bg-red-600 transition"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* === Specifications === */}
              <FieldArray name="specifications">
                {({ push, remove }) => (
                  <div className="space-y-2 mt-4">
                    <label className="text-sm font-medium text-slate-700">
                      مشخصات فنی
                    </label>
                    {values.specifications.map((spec, idx) => {
                      const specErrors = errors.specifications as
                        | FormikErrors<{ key: string; value: string }>[]
                        | undefined;
                      return (
                        <div
                          key={idx}
                          className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] items-center gap-2 bg-white/50 border border-slate-200 rounded-lg p-2 shadow-sm"
                        >
                          <Field
                            name={`specifications[${idx}].key`}
                            placeholder="کلید (مثلاً: ولتاژ)"
                            className="bg-white/60 border border-slate-300 rounded-lg px-3 py-2 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-400"
                          />
                          <Field
                            name={`specifications[${idx}].value`}
                            placeholder="مقدار (مثلاً: ۳۸۰ ولت)"
                            className="bg-white/60 border border-slate-300 rounded-lg px-3 py-2 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-400"
                          />
                          <button
                            type="button"
                            onClick={() => remove(idx)}
                            className="p-2 text-red-500 hover:text-red-700 transition flex justify-center"
                          >
                            <FiTrash2 />
                          </button>
                          {(specErrors?.[idx]?.key ||
                            specErrors?.[idx]?.value) && (
                            <div className="col-span-3 text-xs text-red-500 mt-1">
                              {(specErrors?.[idx]?.key as string) ||
                                (specErrors?.[idx]?.value as string)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => push({ key: "", value: "" })}
                      className="mt-3 px-3 py-2 bg-gradient-to-r from-cyan-500 to-cyan-700 text-white rounded-lg shadow hover:scale-105 transition"
                    >
                      افزودن مشخصه +
                    </button>
                  </div>
                )}
              </FieldArray>

              {/* === Featured toggle === */}
              <label className="flex items-center gap-2 mt-4 text-slate-700 text-sm">
                <Field type="checkbox" name="isFeatured" className="w-4 h-4" />
                محصول ویژه
              </label>

              {/* === Submit === */}
              <button
                type="submit"
                className="w-full mt-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-cyan-500 to-cyan-700 shadow-lg hover:shadow-[0_0_12px_rgba(6,182,212,0.5)] hover:scale-[1.03] transition-all"
              >
                ثبت محصول
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

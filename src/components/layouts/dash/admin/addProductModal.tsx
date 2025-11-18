"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray, FormikErrors } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import toast from "react-hot-toast";

//------------------------------------------------------
// Schema
//------------------------------------------------------
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
});

//------------------------------------------------------
// Input Wrapper Component
//------------------------------------------------------
function InputField({
  label,
  error,
  children,
}: {
  label?: string;
  error?: string | false | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

//------------------------------------------------------
// Main Component
//------------------------------------------------------
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

  //------------------------------------------------------
  // Fetch categories
  //------------------------------------------------------
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data?.data) setCategories(data.data);
      } catch (err) {
        console.error("خطا در دریافت کتگوری‌ها:", err);
      }
    };
    fetchCats();
  }, []);

  // Cleanup URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  //------------------------------------------------------
  // JSX
  //------------------------------------------------------
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xl animate-fadeIn"
    >
      <div className="w-[90%] md:w-[650px] rounded-2xl bg-white/80 backdrop-blur-xl shadow-2xl border border-slate-200 p-6 animate-scaleIn overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-5 border-b border-slate-200 pb-3">
          <h2 className="text-xl font-bold text-gray-800">افزودن محصول جدید</h2>
          <button
            onClick={onClose}
            className="text-cyan-600 hover:text-cyan-800 font-semibold"
          >
            ✕
          </button>
        </div>

        {/* Formik */}
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
          onSubmit={async (values, { resetForm }) => {
            const fd = new FormData();

            const specsObj: any = {};
            values.specifications.forEach((s) => {
              specsObj[s.key] = s.value;
            });
            fd.append("specifications", JSON.stringify(specsObj));

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
              resetForm();
              onAdd();
              onClose();
            }

            toast.error("خطایی رخ داده است ...", {className: "z-50", position: "top-center"});
          }}
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form className="space-y-5 font-vazir">
              {/* Name */}
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
                  className="input bg-white/70 border border-slate-300 rounded-xl w-full"
                  placeholder="مثلاً: اینورتر 5.5 کیلووات"
                />
              </InputField>

              {/* Slug */}
              <InputField
                label="شناسه (slug)"
                error={touched.slug && errors.slug}
              >
                <Field
                  name="slug"
                  className="input bg-white/70 border border-slate-300 rounded-xl w-full"
                />
              </InputField>

              {/* Brand / Category / Model */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="برند">
                  <Field
                    name="brand"
                    className="input bg-white/70 border border-slate-300 rounded-xl w-full"
                  />
                </InputField>

                <InputField
                  label="دسته‌بندی"
                  error={touched.category && errors.category}
                >
                  <Field
                    as="select"
                    name="category"
                    className="input appearance-none bg-white/70 border border-slate-300 rounded-xl w-full focus:border-cyan-500 focus:ring-0"
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
                    className="input bg-white/70 border border-slate-300 rounded-xl w-full"
                  />
                </InputField>
              </div>

              {/* Description */}
              <InputField label="توضیحات">
                <Field
                  as="textarea"
                  name="description"
                  className="input bg-white/70 border border-slate-300 rounded-xl h-24 resize-none w-full"
                />
              </InputField>

              {/* Image */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  تصویر محصول
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="text-gray-700"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFieldValue("image", file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />
                {preview && (
                  <Image
                    src={preview}
                    alt="preview"
                    width={220}
                    height={160}
                    className="mt-2 rounded-xl border object-cover aspect-video shadow-md"
                  />
                )}
              </div>

              {/* Specifications */}
              <FieldArray name="specifications">
                {({ push, remove }) => (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      مشخصات فنی
                    </label>
                    {values.specifications.map((spec, idx) => {
                      const specErrors = errors.specifications as
                        | FormikErrors<{ key: string; value: string }>[]
                        | undefined;
                      return (
                        <div
                          key={idx}
                          className="border border-slate-200 rounded-xl p-3 space-y-3 bg-white/50 shadow-sm"
                        >
                          <InputField error={specErrors?.[idx]?.key}>
                            <Field
                              name={`specifications[${idx}].key`}
                              placeholder="کلید (مثلاً: ولتاژ)"
                              className="input bg-white/70 border border-slate-300 rounded-lg w-full"
                            />
                          </InputField>

                          <InputField error={specErrors?.[idx]?.value}>
                            <Field
                              name={`specifications[${idx}].value`}
                              placeholder="مقدار (مثلاً: ۳۸۰ ولت)"
                              className="input bg-white/70 border border-slate-300 rounded-lg w-full"
                            />
                          </InputField>

                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => remove(idx)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              حذف مشخصه
                            </button>
                          )}
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => push({ key: "", value: "" })}
                      className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all"
                    >
                      افزودن مشخصه +
                    </button>
                  </div>
                )}
              </FieldArray>

              {/* Featured */}
              <label className="flex items-center gap-2 mt-4 text-gray-700 text-sm">
                <Field type="checkbox" name="isFeatured" className="w-4 h-4" />
                محصول ویژه
              </label>

              {/* Submit */}
              <button
                type="submit"
                className="w-full mt-6 py-3 rounded-xl text-white font-semibold bg-linear-to-r from-cyan-500 to-cyan-700 shadow-lg hover:scale-[1.02] transition-all"
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

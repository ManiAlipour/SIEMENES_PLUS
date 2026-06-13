"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, FormikErrors } from "formik";
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

  useEffect(() => {
    lock();
    return () => unlock();
  }, []);

  return (
    <div className="fixed inset-0 mt-12 lg:mt-5 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xl animate-fadeIn">
      <div className="w-[90%] md:w-[650px] rounded-2xl bg-white/80 backdrop-blur-2xl shadow-xl border border-slate-200 p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-6">
            {mode === "create" ? "افزودن محصول جدید" : "ویرایش محصول"}
          </h2>

          <button className="mb-2" onClick={onClose}>
            <IoClose />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={ProductSchema}
          enableReinitialize
          onSubmit={onSubmit}
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form className="space-y-5">
              {/* === Basic Info === */}
              <InputField
                label="نام محصول"
                error={touched.name && (errors.name as string)}
              >
                <Field
                  name="name"
                  onChange={(e: any) => {
                    const value = e.target.value;
                    setFieldValue("name", value);
                    if (mode === "create") {
                      setFieldValue(
                        "slug",
                        value.replace(/\s+/g, "-").toLowerCase(),
                      );
                    }
                  }}
                  className="input"
                />
              </InputField>

              <InputField
                label="شناسه"
                error={touched.slug && (errors.slug as string)}
              >
                <Field name="slug" className="input" />
              </InputField>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="برند">
                  <Field name="brand" className="input" />
                </InputField>

                <InputField
                  label="دسته‌بندی"
                  error={touched.category && (errors.category as string)}
                >
                  <Field as="select" name="category" className="input">
                    <option value="">انتخاب کنید...</option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </Field>
                </InputField>

                <InputField label="شماره مدل">
                  <Field name="modelNumber" className="input" />
                </InputField>
              </div>

              <InputField label="توضیحات">
                <Field
                  as="textarea"
                  name="description"
                  className="input h-24 resize-none"
                />
              </InputField>

              {/* === Image === */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  تصویر محصول
                </label>

                <div className="relative border-2 border-dashed border-cyan-400/40 rounded-xl p-6 flex justify-center items-center">
                  {!preview && (
                    <>
                      <FiCamera size={32} className="text-cyan-500" />
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
                        className="rounded-xl object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setFieldValue("image", null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* === Specifications === */}
              <FieldArray name="specifications">
                {({ push, remove }) => (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700">
                      مشخصات فنی
                    </label>

                    {values.specifications.map((_: any, idx: number) => (
                      <div
                        key={idx}
                        className="grid grid-cols-[1fr_1fr_auto] gap-2"
                      >
                        <Field
                          name={`specifications[${idx}].key`}
                          placeholder="کلید"
                          className="input"
                        />
                        <Field
                          name={`specifications[${idx}].value`}
                          placeholder="مقدار"
                          className="input"
                        />
                        <button
                          type="button"
                          onClick={() => remove(idx)}
                          className="text-red-500"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => push({ key: "", value: "" })}
                      className="px-3 py-2 bg-cyan-600 text-white rounded-lg"
                    >
                      افزودن مشخصه +
                    </button>
                  </div>
                )}
              </FieldArray>

              <label className="flex items-center gap-2 text-sm">
                <Field type="checkbox" name="isFeatured" />
                محصول ویژه
              </label>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-white bg-gradient-to-r from-cyan-500 to-cyan-700"
              >
                {submitText}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {/* shared input style */}
      <style jsx>{`
        .input {
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid #cbd5e1;
          border-radius: 0.75rem;
          width: 100%;
          padding: 0.5rem 0.75rem;
          transition: all 0.2s ease;
        }
        .input:focus {
          outline: none;
          border-color: #06b6d4;
          box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.3);
        }
      `}</style>
    </div>
  );
}

"use client";

import { useRef } from "react";
import { Formik, Form, Field } from "formik";
import type { Category, CategoryFormValues } from "./types";
import { categoryFormSchema } from "./types";

const INITIAL_VALUES: CategoryFormValues = {
  name: "",
  slug: "",
  parent: "",
  description: "",
  isFeatured: false,
};

const CARD_STYLES =
  "rounded-2xl border border-slate-200/60 bg-white/75 backdrop-blur-xl " +
  "shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(6,182,212,0.07)] " +
  "p-3 sm:p-6 transition-all duration-300";

const INPUT_STYLES =
  "mt-1 w-full rounded-xl border border-slate-300 bg-white/70 px-3 py-2 " +
  "focus:outline-none focus:ring-2 focus:ring-cyan-500 text-base";

type CategoryFormProps = {
  categories: Category[];
  onSuccess: () => void;
};

/**
 * Form for adding a new category. Handles both JSON and multipart (with image) submit.
 * Auto-generates slug from name; supports parent, description, isFeatured, and optional image.
 */
export default function CategoryForm({ categories, onSuccess }: CategoryFormProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (values: CategoryFormValues, resetForm: () => void) => {
    const file = imageInputRef.current?.files?.[0];
    let res: Response;

    if (file) {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("slug", values.slug);
      if (values.parent) formData.append("parent", values.parent);
      if (values.description) formData.append("description", values.description);
      formData.append("isFeatured", String(values.isFeatured));
      formData.append("image", file);
      res = await fetch("/api/admin/categories", { method: "POST", body: formData });
    } else {
      const cleanValues: Record<string, unknown> = { ...values };
      if (!cleanValues.parent) delete cleanValues.parent;
      res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanValues),
      });
    }

    if (res.ok) {
      resetForm();
      if (imageInputRef.current) imageInputRef.current.value = "";
      onSuccess();
    } else {
      const data = await res.json();
      alert(data.message || "خطا در ثبت دسته");
    }
  };

  return (
    <div className={CARD_STYLES}>
      <h2 className="text-base sm:text-lg font-semibold mb-4 text-cyan-700">
        افزودن دسته جدید
      </h2>

      <Formik
        initialValues={INITIAL_VALUES}
        validationSchema={categoryFormSchema}
        onSubmit={async (values, { resetForm }) => handleSubmit(values, resetForm)}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form className="space-y-3 sm:space-y-4">
            {/* Name — typing here auto-fills slug */}
            <div>
              <label className="text-sm font-medium text-gray-700">نام دسته</label>
              <Field
                name="name"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  setFieldValue("name", value);
                  setFieldValue("slug", value.replace(/\s+/g, "-").toLowerCase());
                }}
                className={INPUT_STYLES}
                placeholder="مثلاً: اینورترها"
              />
              {touched.name && errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="text-sm font-medium text-gray-700">شناسه (slug)</label>
              <Field
                name="slug"
                className={INPUT_STYLES}
                placeholder="مثلاً: inverter"
              />
              {touched.slug && errors.slug && (
                <p className="text-xs text-red-500 mt-1">{errors.slug}</p>
              )}
            </div>

            {/* Parent category (optional) */}
            <div>
              <label className="text-sm font-medium text-gray-700">دسته والد (اختیاری)</label>
              <Field
                as="select"
                name="parent"
                className={INPUT_STYLES}
              >
                <option value="">(بدون والد)</option>
                {categories.filter((c) => c._id).map((c) => (
                  <option value={c._id} key={c._id}>{c.name}</option>
                ))}
              </Field>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-gray-700">توضیحات</label>
              <Field
                as="textarea"
                name="description"
                className={INPUT_STYLES + " min-h-[88px] resize-none"}
                placeholder="توضیح کوتاهی درباره‌ دسته بنویسید..."
              />
            </div>

            {/* Featured toggle */}
            <div className="flex items-center gap-2">
              <Field name="isFeatured">
                {({ field, form }: { field: { value: boolean }; form: { setFieldValue: (n: string, v: boolean) => void } }) => (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-pressed={field.value}
                      className={`h-5 w-10 rounded-full relative transition-colors ${field.value ? "bg-cyan-600" : "bg-slate-200"}`}
                      onClick={() => form.setFieldValue("isFeatured", !field.value)}
                    >
                      <span
                        className={`block transition-all duration-200 rounded-full bg-white border h-5 w-5 absolute top-0 ${field.value ? "right-0" : "left-0"} shadow`}
                      />
                    </button>
                    <label className="text-sm text-gray-700 select-none">
                      نمایش به عنوان دسته منتخب
                    </label>
                    {field.value && (
                      <button
                        type="button"
                        aria-label="انصراف منتخب"
                        onClick={() => form.setFieldValue("isFeatured", false)}
                        className="text-xs text-gray-500 hover:text-red-500 px-2 py-0.5 rounded"
                      >
                        لغو منتخب
                      </button>
                    )}
                  </div>
                )}
              </Field>
            </div>

            {/* Optional image */}
            <div>
              <label className="text-sm font-medium text-gray-700">تصویر دسته (اختیاری)</label>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className={INPUT_STYLES + " text-sm"}
                aria-label="انتخاب تصویر دسته"
              />
              <p className="text-xs text-slate-500 mt-1">
                تصویر در بخش دسته‌های منتخب نمایش داده می‌شود
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-linear-to-r from-cyan-500 to-cyan-700 text-white rounded-xl font-semibold shadow-md text-base hover:scale-[1.02] transition-all duration-300"
            >
              ثبت دسته
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

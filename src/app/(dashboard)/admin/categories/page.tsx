"use client";

import { useEffect, useState, useRef } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// Prepare types based on model
type Category = {
  _id: string;
  name: string;
  slug: string;
  parent?: string | null;
  description?: string;
  image?: string;
  isFeatured?: boolean;
};

const CategorySchema = Yup.object().shape({
  name: Yup.string().required("نام دسته الزامی است"),
  slug: Yup.string().required("شناسه (slug) لازم است").lowercase(),
  parent: Yup.string().nullable(),
  description: Yup.string().nullable(),
  isFeatured: Yup.boolean().default(false),
});

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  //---------------------------
  // 🧩 Fetch categories
  //---------------------------
  const fetchCats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.data || []);
    } catch (err) {
      console.error(err);
      setErrorMsg("خطا در دریافت دسته‌ها!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  //---------------------------
  // 🗑 Delete category
  //---------------------------
  const deleteCat = async (id: string) => {
    if (!confirm("آیا از حذف این دسته مطمئن هستید؟")) return;
    try {
      await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      fetchCats();
    } catch (err) {
      console.error(err);
      alert("حذف دسته با خطا مواجه شد!");
    }
  };

  // Helper to get parent category name by id
  const getParentName = (parentId: string | null | undefined) => {
    if (!parentId) return "—";
    const parent = categories.find((cat) => cat._id === parentId);
    return parent ? parent.name : "—";
  };

  //---------------------------
  // 🧱 JSX
  //---------------------------
  return (
    <div
      dir="rtl"
      className="relative z-0 min-h-screen font-vazirmatn
        bg-linear-to-br from-white via-slate-50 to-cyan-50/30
        p-2 sm:p-4 md:p-6 lg:p-8 transition-colors duration-300"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-10 border-b border-slate-200 pb-3 gap-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 tracking-tight">
          مدیریت دسته‌بندی‌ها
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* Form Section */}
        <div
          className="rounded-2xl border border-slate-200/60 bg-white/75 backdrop-blur-xl
                     shadow-[0_4px_12px_rgba(0,0,0,0.04)]
                     hover:shadow-[0_8px_20px_rgba(6,182,212,0.07)]
                     p-3 sm:p-6 transition-all duration-300"
        >
          <h2 className="text-base sm:text-lg font-semibold mb-4 text-cyan-700">
            افزودن دسته جدید
          </h2>

          <Formik
            initialValues={{
              name: "",
              slug: "",
              parent: "",
              description: "",
              isFeatured: false,
            }}
            validationSchema={CategorySchema}
            onSubmit={async (values, { resetForm }) => {
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
                res = await fetch("/api/admin/categories", {
                  method: "POST",
                  body: formData,
                });
              } else {
                // only send parent if set
                const cleanValues: any = { ...values };
                if (!cleanValues.parent) {
                  // Fix: make property optional before delete
                  (cleanValues as { parent?: string }).parent = undefined;
                  delete (cleanValues as { parent?: string }).parent;
                }
                res = await fetch("/api/admin/categories", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(cleanValues),
                });
              }
              if (res.ok) {
                resetForm();
                if (imageInputRef.current) imageInputRef.current.value = "";
                fetchCats();
              } else {
                const data = await res.json();
                alert(data.message || "خطا در ثبت دسته");
              }
            }}
          >
            {({ errors, touched, setFieldValue, values }) => (
              <Form className="space-y-3 sm:space-y-4">
                {/* 🔸 Name */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    نام دسته
                  </label>
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
                    className="mt-1 w-full rounded-xl border border-slate-300
                               bg-white/70 px-3 py-2 focus:outline-none focus:ring-2
                               focus:ring-cyan-500 text-base"
                    placeholder="مثلاً: اینورترها"
                  />
                  {touched.name && errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    شناسه (slug)
                  </label>
                  <Field
                    name="slug"
                    className="mt-1 w-full rounded-xl border border-slate-300
                               bg-white/70 px-3 py-2 focus:outline-none focus:ring-2
                               focus:ring-cyan-500 text-base"
                    placeholder="مثلاً: inverter"
                  />
                  {touched.slug && errors.slug && (
                    <p className="text-xs text-red-500 mt-1">{errors.slug}</p>
                  )}
                </div>

                {/* Parent */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    دسته والد (اختیاری)
                  </label>
                  <Field
                    as="select"
                    name="parent"
                    className="mt-1 w-full rounded-xl border border-slate-300
                               bg-white/70 px-3 py-2 focus:outline-none focus:ring-2
                               focus:ring-cyan-500 text-base"
                  >
                    <option value="">(بدون والد)</option>
                    {categories
                      .filter((cat) => cat._id)
                      .map((cat) => (
                        <option value={cat._id} key={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                  </Field>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    توضیحات
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    className="mt-1 w-full min-h-[88px] resize-none rounded-xl border border-slate-300
                               bg-white/70 px-3 py-2 focus:outline-none focus:ring-2
                               focus:ring-cyan-500 text-base"
                    placeholder="توضیح کوتاهی درباره‌ دسته بنویسید..."
                  />
                </div>

                {/* Featured */}
                <div className="flex items-center gap-2">
                  {/* Replaced normal checkbox with a toggle-able UI and clear button */}
                  <Field name="isFeatured">
                    {({ field, form }: any) => (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-pressed={field.value}
                          className={`h-5 w-10 rounded-full relative transition-colors
                            ${field.value ? "bg-cyan-600" : "bg-slate-200"}`}
                          onClick={() => form.setFieldValue("isFeatured", !field.value)}
                        >
                          <span
                            className={`block transition-all duration-200 rounded-full bg-white border
                              h-5 w-5 absolute top-0 ${field.value ? "right-0" : "left-0"}
                              shadow`}
                          />
                        </button>
                        <label htmlFor="isFeatured" className="text-sm text-gray-700 select-none">
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

                {/* Image */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    تصویر دسته (اختیاری)
                  </label>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="mt-1 w-full rounded-xl border border-slate-300
                               bg-white/70 px-3 py-2 text-sm focus:outline-none focus:ring-2
                               focus:ring-cyan-500"
                    aria-label="انتخاب تصویر دسته"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    تصویر در بخش دسته‌های منتخب نمایش داده می‌شود
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-linear-to-r from-cyan-500 to-cyan-700
                             text-white rounded-xl font-semibold shadow-md text-base
                             hover:scale-[1.02] transition-all duration-300"
                >
                  ثبت دسته
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Table Section */}
        <div
          className="rounded-2xl border border-slate-200/60 bg-white/75 backdrop-blur-xl
                     shadow-[0_4px_12px_rgba(0,0,0,0.04)]
                     hover:shadow-[0_8px_20px_rgba(6,182,212,0.07)]
                     p-3 sm:p-6 transition-all duration-300"
        >
          <h2 className="text-base sm:text-lg font-semibold mb-4 text-cyan-700">
            لیست دسته‌ها
          </h2>

          {loading ? (
            <p className="text-slate-500">در حال دریافت اطلاعات...</p>
          ) : errorMsg ? (
            <p className="text-red-500">{errorMsg}</p>
          ) : categories.length === 0 ? (
            <p className="text-slate-500 text-sm">هنوز دسته‌ای ثبت نشده است.</p>
          ) : (
            <div>
              {/* Mobile/Small screen: Card-style list */}
              <div className="flex flex-col gap-3 md:hidden">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="flex flex-col rounded-xl border border-slate-200 bg-white/90 shadow hover:shadow-md p-3 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {cat.image ? (
                          <a
                            href={cat.image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0"
                          >
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-12 h-12 object-cover rounded-lg bg-slate-100 border"
                            />
                          </a>
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center text-slate-300 bg-slate-100 rounded-lg border text-xl select-none">
                            <span>—</span>
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-gray-900 text-base">{cat.name}</div>
                          <div className="text-xs text-gray-400 break-all ltr:font-mono ltr:direction-ltr">{cat.slug}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteCat(cat._id)}
                        className="px-3 py-1 text-xs text-red-600 bg-red-500/10 rounded-xl border border-red-500/20 hover:bg-red-600 hover:text-white transition-all duration-200"
                      >
                        حذف
                      </button>
                    </div>
                    <div className="flex items-center flex-wrap justify-between mt-3 gap-y-2 gap-x-4 pl-1">
                      <div className="flex flex-col flex-1">
                        <span className="text-[12px] text-slate-400">دسته والد:</span>
                        <span className="text-sm font-medium text-slate-700">{getParentName(cat.parent)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[12px] text-slate-400">منتخب:</span>
                        <span className={`text-[13px] font-semibold ${cat.isFeatured ? "text-cyan-600" : "text-slate-400"}`}>
                          {cat.isFeatured ? "بله" : "خیر"}
                        </span>
                      </div>
                    </div>
                    {cat.description && (
                      <div className="mt-3 text-xs text-gray-500 leading-relaxed wrap-break-word border-t border-slate-100 pt-2">
                        {cat.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Desktop/tablet: Table layout */}
              <div className="hidden md:block w-full overflow-x-auto">
                <table className="w-full text-sm text-gray-700 min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-300">
                      <th className="py-2 text-right whitespace-nowrap">نام</th>
                      <th className="py-2 text-right whitespace-nowrap">شناسه</th>
                      <th className="py-2 text-right whitespace-nowrap">دسته والد</th>
                      <th className="py-2 text-center whitespace-nowrap">تصویر</th>
                      <th className="py-2 text-right whitespace-nowrap">منتخب؟</th>
                      <th className="py-2 text-right whitespace-nowrap">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr
                        key={cat._id}
                        className="border-b border-slate-200 hover:bg-cyan-50/60 transition-colors"
                      >
                        <td className="py-2">{cat.name}</td>
                        <td className="py-2 break-all ltr:font-mono ltr:direction-ltr">{cat.slug}</td>
                        <td className="py-2">{getParentName(cat.parent)}</td>
                        <td className="py-2 text-center">
                          {cat.image ? (
                            <a href={cat.image} target="_blank" rel="noopener noreferrer" className="inline-block">
                              <img src={cat.image} alt={cat.name} className="w-10 h-10 object-cover rounded-lg mx-auto" />
                            </a>
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="py-2 text-right">
                          {cat.isFeatured ? (
                            <span className="inline-flex items-center gap-1 text-cyan-600 font-bold">
                              بله
                            </span>
                          ) : (
                            <span className="text-slate-400">خیر</span>
                          )}
                        </td>
                        <td className="py-2 text-right">
                          <button
                            type="button"
                            onClick={() => deleteCat(cat._id)}
                            className="px-2 py-1 text-xs text-red-600
                                      bg-red-500/10 rounded-lg border border-red-500/20
                                      hover:bg-red-600 hover:text-white
                                      transition-all duration-200"
                          >
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const CategorySchema = Yup.object().shape({
  name: Yup.string().required("نام دسته الزامی است"),
  slug: Yup.string().required("شناسه (slug) لازم است").lowercase(),
  description: Yup.string().nullable(),
});

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<
    { _id: string; name: string; slug: string; description?: string; image?: string }[]
  >([]);
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

  //---------------------------
  // 🧱 JSX
  //---------------------------
  return (
    <div
      dir="rtl"
      className="relative z-0 min-h-screen font-vazirmatn
                 bg-gradient-to-br from-white via-slate-50 to-cyan-50/30
                 p-6 sm:p-8 transition-colors duration-300"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-10 border-b border-slate-200 pb-3">
        <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
          مدیریت دسته‌بندی‌ها
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div
          className="rounded-2xl border border-slate-200/60 bg-white/75 backdrop-blur-xl
                     shadow-[0_8px_20px_rgba(0,0,0,0.05)]
                     hover:shadow-[0_12px_28px_rgba(6,182,212,0.12)]
                     p-6 transition-all duration-300"
        >
          <h2 className="text-lg font-semibold mb-4 text-cyan-700">
            افزودن دسته جدید
          </h2>

          <Formik
            initialValues={{ name: "", slug: "", description: "" }}
            validationSchema={CategorySchema}
            onSubmit={async (values, { resetForm }) => {
              const file = imageInputRef.current?.files?.[0];
              let res: Response;

              if (file) {
                const formData = new FormData();
                formData.append("name", values.name);
                formData.append("slug", values.slug);
                if (values.description) formData.append("description", values.description);
                formData.append("image", file);
                res = await fetch("/api/admin/categories", {
                  method: "POST",
                  body: formData,
                });
              } else {
                res = await fetch("/api/admin/categories", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(values),
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
            {({ errors, touched, setFieldValue }) => (
              <Form className="space-y-4">
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
                               focus:ring-cyan-500"
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
                               focus:ring-cyan-500"
                    placeholder="مثلاً: inverter"
                  />
                  {touched.slug && errors.slug && (
                    <p className="text-xs text-red-500 mt-1">{errors.slug}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    توضیحات
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    className="mt-1 w-full h-24 resize-none rounded-xl border border-slate-300
                               bg-white/70 px-3 py-2 focus:outline-none focus:ring-2
                               focus:ring-cyan-500"
                    placeholder="توضیح کوتاهی درباره‌ دسته بنویسید..."
                  />
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
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-700
                             text-white rounded-xl font-semibold shadow-md
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
                     shadow-[0_8px_20px_rgba(0,0,0,0.05)]
                     hover:shadow-[0_12px_28px_rgba(6,182,212,0.12)]
                     p-6 transition-all duration-300"
        >
          <h2 className="text-lg font-semibold mb-4 text-cyan-700">
            لیست دسته‌ها
          </h2>

          {loading ? (
            <p className="text-slate-500">در حال دریافت اطلاعات...</p>
          ) : errorMsg ? (
            <p className="text-red-500">{errorMsg}</p>
          ) : categories.length === 0 ? (
            <p className="text-slate-500 text-sm">هنوز دسته‌ای ثبت نشده است.</p>
          ) : (
            <table className="w-full text-sm text-gray-700">
              <thead>
                <tr className="border-b border-slate-300">
                  <th className="py-2 text-right">نام</th>
                  <th className="py-2 text-right">شناسه</th>
                  <th className="py-2 text-center">تصویر</th>
                  <th className="py-2 text-right">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr
                    key={cat._id}
                    className="border-b border-slate-200 hover:bg-cyan-50/60 transition-colors"
                  >
                    <td className="py-2">{cat.name}</td>
                    <td className="py-2">{cat.slug}</td>
                    <td className="py-2 text-center">
                      {cat.image ? (
                        <a href={cat.image} target="_blank" rel="noopener noreferrer" className="inline-block">
                          <img src={cat.image} alt={cat.name} className="w-10 h-10 object-cover rounded-lg" />
                        </a>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-2 text-right">
                      <button
                        type="button"
                        onClick={() => deleteCat(cat._id)}
                        className="px-3 py-1.5 text-xs text-red-600
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
          )}
        </div>
      </div>
    </div>
  );
}

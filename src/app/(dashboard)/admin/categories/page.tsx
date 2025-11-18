"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { slugify, transliterate } from "transliteration";

const CategorySchema = Yup.object().shape({
  name: Yup.string().required("نام دسته الزامی است"),
  slug: Yup.string().required("شناسه (slug) لازم است").lowercase(),
  description: Yup.string().nullable(),
});

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<
    { _id: string; name: string; slug: string; description?: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  //------------------------------------------------------
  // Fetch categories
  //------------------------------------------------------
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

  // first render
  useEffect(() => {
    fetchCats();
  }, []);

  //------------------------------------------------------
  // Delete category
  //------------------------------------------------------
  const deleteCat = async (id: string) => {
    if (!confirm("آیا از حذف این دسته مطمئن هستید؟")) return;
    try {
      await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      fetchCats(); // refresh list
    } catch (err) {
      console.error(err);
      alert("حذف دسته با خطا مواجه شد!");
    }
  };

  //------------------------------------------------------
  // JSX
  //------------------------------------------------------
  return (
    <div className="relative z-0 bg-linear-to-br from-white via-slate-50 to-cyan-50/30 min-h-screen p-6 font-vazir">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-3">
        <h1 className="text-2xl font-extrabold text-gray-800">
          مدیریت دسته‌بندی‌ها
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-cyan-700">
            افزودن دسته جدید
          </h2>

          <Formik
            initialValues={{ name: "", slug: "", description: "" }}
            validationSchema={CategorySchema}
            onSubmit={async (values, { resetForm }) => {
              const res = await fetch("/api/admin/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
              });
              if (res.ok) {
                resetForm();
                fetchCats();
              }
            }}
          >
            {({ errors, touched, setFieldValue }) => (
              <Form className="space-y-4">
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
                    className="input bg-white/70 border border-slate-300 rounded-xl w-full"
                    placeholder="مثلاً: اینورترها"
                  />
                  {touched.name && errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    شناسه (slug)
                  </label>
                  <Field
                    name="slug"
                    className="input bg-white/70 border border-slate-300 rounded-xl w-full"
                    placeholder="مثلاً: inverter"
                  />
                  {touched.slug && errors.slug && (
                    <p className="text-xs text-red-500 mt-1">{errors.slug}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    توضیحات
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    className="input bg-white/70 border border-slate-300 rounded-xl w-full h-24 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-linear-to-r from-cyan-500 to-cyan-700 text-white rounded-xl font-semibold shadow-md hover:scale-[1.02] transition-all"
                >
                  ثبت دسته
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Table Section */}
        <div className="bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-cyan-700">
            لیست دسته‌ها
          </h2>

          {loading ? (
            <p className="text-gray-500">در حال دریافت اطلاعات...</p>
          ) : errorMsg ? (
            <p className="text-red-500">{errorMsg}</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-500 text-sm">هنوز دسته‌ای ثبت نشده است.</p>
          ) : (
            <table className="w-full text-sm text-gray-700">
              <thead>
                <tr className="border-b border-slate-300">
                  <th className="py-2 text-right">نام</th>
                  <th className="py-2 text-right">شناسه</th>
                  <th className="py-2 text-right">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr
                    key={cat._id}
                    className="border-b border-slate-200 hover:bg-cyan-50/60 transition"
                  >
                    <td className="py-2">{cat.name}</td>
                    <td className="py-2">{cat.slug}</td>
                    <td className="py-2 text-right">
                      <button
                        type="button"
                        onClick={() => deleteCat(cat._id)}
                        className="px-3 py-1.5 text-xs bg-red-500/20 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
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

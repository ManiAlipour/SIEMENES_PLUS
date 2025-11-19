"use client";

import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import AddBlogModal from "@/components/layouts/dash/admin/AddBlogModal";

interface Blog {
  _id: string;
  title: string;
  author: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all blogs when component mounts
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/blogs");
      const data = await res.json();
      if (data?.data) setBlogs(data.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      toast.error("خطا در دریافت بلاگ‌ها");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete blog and log action
  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm("آیا از حذف این بلاگ مطمئن هستید؟");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetch("/api/admin/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: "مانی ایمانی",
            action: "DELETE_BLOG",
            entity: "blog",
            entityName: title,
          }),
        });

        toast.success("بلاگ حذف شد ✅", {
          className: "font-vazirmatn",
        });
        fetchBlogs();
      } else {
        toast.error("خطا در حذف بلاگ");
      }
    } catch (err) {
      console.error(err);
      toast.error("خطا در ارتباط با سرور");
    }
  };

  return (
    <div className="p-6 font-vazirmatn">
      {/* 🩶 Header Section */}
      <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-cyan-500 to-cyan-700 text-white rounded-2xl p-4 shadow-lg backdrop-blur-xl">
        <h1 className="text-xl font-bold">مدیریت بلاگ‌ها</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white rounded-xl px-4 py-2 shadow-md transition-all"
        >
          <FiPlus /> افزودن بلاگ جدید
        </button>
      </div>

      {/* 🩶 Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-slate-200 rounded-lg overflow-hidden bg-white/70 backdrop-blur-md shadow-md text-slate-700">
          <thead>
            <tr className="bg-gradient-to-r from-cyan-500 to-cyan-700 text-white text-sm font-medium">
              <th className="py-3 px-4 text-left">عنوان</th>
              <th className="py-3 px-4 text-left">نویسنده</th>
              <th className="py-3 px-4 text-left">دسته‌بندی</th>
              <th className="py-3 px-4 text-center">انتشار</th>
              <th className="py-3 px-4 text-center">تاریخ</th>
              <th className="py-3 px-4 text-center">عملیات</th>
            </tr>
          </thead>

          <tbody>
            {!loading && blogs.length > 0 ? (
              blogs.map((blog) => (
                <tr
                  key={blog._id}
                  className="hover:bg-white/70 transition-all border-b border-slate-200/60"
                >
                  <td className="py-3 px-4">{blog.title}</td>
                  <td className="py-3 px-4">{blog.author}</td>
                  <td className="py-3 px-4">{blog.category}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-3 py-1 text-xs rounded-lg ${
                        blog.isPublished
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      {blog.isPublished ? "منتشر شده" : "پیش‌نویس"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600 text-xs">
                    {new Date(blog.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="py-3 px-4 text-center flex justify-center gap-3">
                    <button
                      onClick={() =>
                        toast("ویرایش در آینده فعال میشود", {
                          className: "font-vazirmatn",
                        })
                      }
                      className="p-2 rounded-lg text-cyan-600 hover:bg-cyan-50 transition"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id, blog.title)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-slate-500 text-sm"
                >
                  {loading ? "در حال بارگذاری..." : "هیچ بلاگی یافت نشد"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ⚙️ Modal add blog */}
      {isModalOpen && (
        <AddBlogModal
          onClose={() => setIsModalOpen(false)}
          onAdd={fetchBlogs}
        />
      )}
    </div>
  );
}

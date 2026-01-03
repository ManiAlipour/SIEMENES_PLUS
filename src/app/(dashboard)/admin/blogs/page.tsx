"use client";

import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import AddBlogModal from "@/components/layouts/dash/admin/AddBlogModal";

interface Blog {
  _id: string;
  title: string;
  video: string;
  status: "draft" | "published";
  createdAt: string;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch blogs on mount
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
      toast.error("خطا در دریافت پست‌ها");
    } finally {
      setLoading(false);
    }
  };

  // Delete handler
  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(`آیا از حذف پست "${title}" مطمئن هستید؟`);
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetch("/api/admin/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "DELETE_BLOG",
            entity: "blog",
            entityName: title,
          }),
        });
        toast.success("پست حذف شد ✅", { className: "font-vazirmatn" });
        fetchBlogs();
      } else {
        toast.error("خطا در حذف پست");
      }
    } catch (err) {
      console.error(err);
      toast.error("خطا در ارتباط با سرور");
    }
  };

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <div className="p-6 font-vazirmatn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 bg-gradient-to-r from-cyan-500 to-cyan-700 text-white rounded-2xl p-4 shadow-lg backdrop-blur-xl">
        <h1 className="text-xl font-bold">مدیریت ویدیوها</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white rounded-xl px-4 py-2 shadow-md transition-all duration-200 hover:scale-95"
        >
          <FiPlus /> افزودن ویدیو جدید
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border border-slate-200 rounded-xl overflow-hidden bg-white/70 backdrop-blur-md shadow-[0_4px_18px_rgba(0,0,0,0.05)] text-slate-700">
          <thead>
            <tr className="bg-gradient-to-r from-cyan-50 via-cyan-100 to-cyan-200 text-slate-700 text-xs font-semibold border-b border-slate-200/50">
              <th className="py-3 px-4 text-left">عنوان</th>
              <th className="py-3 px-4 text-left">لینک ویدیو</th>
              <th className="py-3 px-4 text-center">وضعیت</th>
              <th className="py-3 px-4 text-center">تاریخ</th>
              <th className="py-3 px-4 text-center pl-6">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {!loading && blogs.length > 0 ? (
              blogs.map((blog) => (
                <tr
                  key={blog._id}
                  className="hover:bg-white/90 transition border-b border-slate-200/70"
                >
                  <td className="px-4 py-3 break-words max-w-xs">{blog.title}</td>
                  <td className="px-4 py-3 max-w-xs break-all">
                    <a href={blog.video} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline text-xs">
                      {blog.video}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-[3px] text-xs rounded-full font-semibold ${
                        blog.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {blog.status === "published" ? "منتشر شده" : "پیش‌نویس"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-slate-600">
                    {new Date(blog.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-2">
                    <button
                      onClick={() =>
                        toast("ویرایش در آینده فعال میشود", {
                          className: "font-vazirmatn",
                        })
                      }
                      className="p-2 text-cyan-600 rounded-lg hover:bg-cyan-50 transition-all duration-200 hover:scale-95 hover:opacity-80"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id, blog.title)}
                      className="p-2 text-red-500 rounded-lg hover:bg-red-50 transition-all duration-200 hover:scale-95 hover:opacity-80"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-slate-500 text-sm"
                >
                  {loading ? "در حال بارگذاری..." : "هیچ محتوایی یافت نشد"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col gap-4">
        {loading ? (
          <div className="text-center py-6 text-slate-500 text-sm">
            در حال بارگذاری...
          </div>
        ) : blogs.length > 0 ? (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow border border-slate-200/70"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-sm text-slate-800">
                  {blog.title}
                </h3>
                <span
                  className={`px-2 py-[2px] text-[10px] rounded-full ${
                    blog.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {blog.status === "published" ? "منتشر" : "پیش‌نویس"}
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-1 break-all">
                <a href={blog.video} target="_blank" rel="noopener noreferrer" className="underline text-blue-700">
                  مشاهده ویدیو
                </a>
              </p>
              <p className="text-[11px] text-slate-500 mb-3">
                📅 {new Date(blog.createdAt).toLocaleDateString("fa-IR")}
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => toast("ویرایش در آینده فعال میشود")}
                  className="p-2 text-cyan-600 rounded-lg hover:bg-cyan-50 transition-all duration-200"
                >
                  <FiEdit2 size={15} />
                </button>
                <button
                  onClick={() => handleDelete(blog._id, blog.title)}
                  className="p-2 text-red-500 rounded-lg hover:bg-red-50 transition-all duration-200"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-slate-500 py-6 text-sm">
            هیچ محتوایی یافت نشد
          </div>
        )}
      </div>

      {/* ⚙️ Modal */}
      {isModalOpen && (
        <AddBlogModal
          onClose={() => setIsModalOpen(false)}
          onAdd={fetchBlogs}
        />
      )}
    </div>
  );
}

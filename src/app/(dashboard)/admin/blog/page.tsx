"use client";

import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiFileText } from "react-icons/fi";
import toast from "react-hot-toast";
import AddBlogPostModal from "@/components/layouts/dash/admin/AddBlogPostModal";
import EditBlogPostCard from "@/components/layouts/dash/admin/EditBlogPostCard";
import DeleteBlogPostConfirmModal from "@/components/layouts/dash/admin/DeleteBlogPostConfirmModal";

interface BlogPost {
  _id: string;
  title: string;
  slug?: string | null;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  video?: string;
  tags?: string[];
  status: "draft" | "published";
  createdAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/blog-posts");
      const data = await res.json();
      if (data?.data) setPosts(data.data);
    } catch (err) {
      console.error("Error fetching blog posts:", err);
      toast.error("خطا در دریافت مطالب");
    } finally {
      setLoading(false);
    }
  };

  const openDelete = (id: string, title: string) => {
    setDeleteId(id);
    setDeleteTitle(title);
    setIsDeleteOpen(true);
  };

  const closeDelete = () => {
    setIsDeleteOpen(false);
    setDeleteId(null);
    setDeleteTitle(null);
  };

  const handleDeleted = () => {
    fetchPosts();
    closeDelete();
  };

  return (
    <div className="p-4 sm:p-6 font-vazir min-h-[60vh]">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-2xl p-5 shadow-lg shadow-cyan-500/20">
        <h1 className="text-xl sm:text-2xl font-bold">مدیریت وبلاگ</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-white text-cyan-600 rounded-xl px-5 py-2.5 font-semibold shadow-md hover:bg-white/95 hover:shadow-lg transition-all duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-cyan-500"
        >
          <FiPlus size={20} /> افزودن مطلب جدید
        </button>
      </div>

      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-slate-700">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-xs font-semibold border-b border-slate-200">
              <th className="py-3.5 px-4 text-right">عنوان</th>
              <th className="py-3.5 px-4 text-right">اسلاگ</th>
              <th className="py-3.5 px-4 text-center">وضعیت</th>
              <th className="py-3.5 px-4 text-center">تاریخ</th>
              <th className="py-3.5 px-4 text-center w-28">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0 animate-pulse">
                  <td className="px-4 py-3">
                    <div className="h-5 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2 mt-2" />
                  </td>
                  <td className="px-4 py-3"><div className="h-4 bg-slate-100 rounded w-24" /></td>
                  <td className="px-4 py-3"><div className="h-6 bg-slate-100 rounded-full w-20 mx-auto" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-slate-100 rounded w-16 mx-auto" /></td>
                  <td className="px-4 py-3"><div className="flex justify-center gap-2"><div className="h-8 w-8 bg-slate-100 rounded-lg" /><div className="h-8 w-8 bg-slate-100 rounded-lg" /></div></td>
                </tr>
              ))
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <tr
                  key={post._id}
                  className="hover:bg-cyan-50/50 border-b border-slate-100 last:border-0 transition-colors"
                >
                  <td className="px-4 py-3 max-w-[220px]">
                    <span className="font-medium text-slate-800 truncate block">
                      {post.title}
                    </span>
                    {post.excerpt && (
                      <span className="text-xs text-slate-500 truncate block mt-0.5">
                        {post.excerpt.slice(0, 50)}…
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 font-mono">
                    {post.slug || "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-3 py-1.5 text-xs rounded-full font-medium ${
                        post.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {post.status === "published" ? "منتشر شده" : "پیش‌نویس"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-slate-500">
                    {new Date(post.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => {
                          setEditPost(post);
                          setIsEditOpen(true);
                        }}
                        className="p-2.5 text-cyan-600 rounded-xl hover:bg-cyan-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                        aria-label="ویرایش"
                      >
                        <FiEdit2 size={17} />
                      </button>
                      <button
                        onClick={() => openDelete(post._id, post.title)}
                        className="p-2.5 text-red-500 rounded-xl hover:bg-red-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        aria-label="حذف"
                      >
                        <FiTrash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-0">
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                      <FiFileText size={32} />
                    </div>
                    <p className="text-slate-600 font-medium mb-1">هنوز مطلبی ثبت نشده</p>
                    <p className="text-slate-500 text-sm mb-5">اولین مطلب وبلاگ را اضافه کنید.</p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center gap-2 bg-cyan-500 text-white rounded-xl px-5 py-2.5 font-semibold hover:bg-cyan-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
                    >
                      <FiPlus size={18} /> افزودن مطلب
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
              <div className="flex gap-3 p-4">
                <div className="w-20 h-20 rounded-xl bg-slate-200 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                  <div className="h-5 w-16 bg-slate-100 rounded-full" />
                </div>
              </div>
              <div className="h-12 bg-slate-50" />
            </div>
          ))
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-cyan-100 transition-all"
            >
              <div className="flex gap-3 p-4">
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt=""
                    className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400 text-xs">
                    بدون تصویر
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 text-sm line-clamp-2">
                    {post.title}
                  </h3>
                  {post.slug && (
                    <p className="text-xs text-slate-500 mt-0.5 font-mono truncate">{post.slug}</p>
                  )}
                  <span
                    className={`inline-block mt-2 px-2.5 py-1 text-[10px] rounded-full font-medium ${
                      post.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {post.status === "published" ? "منتشر" : "پیش‌نویس"}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {new Date(post.createdAt).toLocaleDateString("fa-IR")}
                  </p>
                </div>
              </div>
              <div className="flex border-t border-slate-100">
                <button
                  onClick={() => {
                    setEditPost(post);
                    setIsEditOpen(true);
                  }}
                  className="flex-1 py-3.5 flex items-center justify-center gap-2 text-cyan-600 text-sm font-medium hover:bg-cyan-50 transition-colors active:bg-cyan-100"
                >
                  <FiEdit2 size={15} /> ویرایش
                </button>
                <button
                  onClick={() => openDelete(post._id, post.title)}
                  className="flex-1 py-3.5 flex items-center justify-center gap-2 text-red-500 text-sm font-medium border-r border-slate-100 hover:bg-red-50 transition-colors active:bg-red-100"
                >
                  <FiTrash2 size={15} /> حذف
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
              <FiFileText size={32} />
            </div>
            <p className="text-slate-600 font-medium mb-1">هنوز مطلبی ثبت نشده</p>
            <p className="text-slate-500 text-sm mb-5 text-center">اولین مطلب وبلاگ را اضافه کنید.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-cyan-500 text-white rounded-xl px-5 py-2.5 font-semibold hover:bg-cyan-600 transition-colors"
            >
              <FiPlus size={18} /> افزودن مطلب
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <AddBlogPostModal
          onClose={() => setIsModalOpen(false)}
          onAdd={fetchPosts}
        />
      )}

      {isEditOpen && editPost && (
        <EditBlogPostCard
          post={editPost}
          onClose={() => {
            setIsEditOpen(false);
            setEditPost(null);
          }}
          onEdit={() => {
            fetchPosts();
            setIsEditOpen(false);
            setEditPost(null);
          }}
        />
      )}

      {isDeleteOpen && deleteId && deleteTitle && (
        <DeleteBlogPostConfirmModal
          postId={deleteId}
          postTitle={deleteTitle}
          onClose={closeDelete}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}

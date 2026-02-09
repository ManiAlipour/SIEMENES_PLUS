"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCheckCircle, FiXCircle, FiTrash2, FiSearch } from "react-icons/fi";

interface CommentUser {
  _id: string;
  name: string;
  email: string;
}

interface Comment {
  _id: string;
  user: CommentUser;
  targetType: "post" | "product";
  targetId: string;
  text: string;
  approved: boolean;
  createdAt: string;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filtered, setFiltered] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "approved" | "pending"
  >("all");

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/comments");
      const { data } = await res.json();
      setComments(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
      toast.error("خطا در دریافت کامنت‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    let temp = [...comments];
    if (statusFilter !== "all") {
      temp = temp.filter((c) =>
        statusFilter === "approved" ? c.approved : !c.approved,
      );
    }
    if (search.trim()) {
      temp = temp.filter(
        (c) =>
          c.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
          c.user?.email?.toLowerCase().includes(search.toLowerCase()),
      );
    }
    setFiltered(temp);
  }, [comments, statusFilter, search]);

  const handleStatusChange = async (id: string, approve: boolean) => {
    try {

      console.log(`/api/admin/comments?commentId=${id}`);
      const res = await fetch(`/api/admin/comments`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId: id, approved: approve }),
      });
      if (res.ok) {
        toast.success(
          approve ? "کامنت تایید شد ✅" : "کامنت به حالت انتظار برگشت 🚫",
          { className: "font-vazirmatn" },
        );

        // TODO: ADD ACTION LOG
        // await fetch("/api/admin/actions", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     user: user.name,
        //     action: approve ? "APPROVE_COMMENT" : "REVERT_COMMENT",
        //     entity: "comment",
        //     entityName: id,
        //   }),
        // });

        fetchComments();
      } else toast.error("بروزرسانی ناموفق بود");
    } catch (err) {
      console.error(err);
      toast.error("خطا در سرور");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("آیا از حذف کامنت مطمئن هستید؟")) return;

    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetch("/api/admin/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: "مانی ایمانی",
            action: "DELETE_COMMENT",
            entity: "comment",
            entityName: id,
          }),
        });
        toast.success("کامنت حذف شد 🗑");
        fetchComments();
      } else toast.error("خطا در حذف کامنت");
    } catch (err) {
      toast.error("اشکال در ارتباط با سرور");
    }
  };

  // ───────────────────────────────────────────────
  return (
    <div className="p-6 font-vazirmatn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 bg-gradient-to-r from-cyan-500 to-cyan-700 text-white rounded-2xl p-4 shadow-lg backdrop-blur-xl">
        <h1 className="text-xl font-bold">مدیریت کامنت‌ها</h1>

        {/* Filter / Search */}
        <div className="flex flex-wrap items-center gap-2 bg-white/20 px-3 py-2 rounded-xl text-white w-full sm:w-auto mt-2 sm:mt-0">
          <FiSearch />
          <input
            type="text"
            placeholder="جستجو نام یا ایمیل..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none placeholder-white/70 flex-1"
          />
          <select
            onChange={(e) => setStatusFilter(e.target.value as any)}
            value={statusFilter}
            className="bg-white/20 text-white text-xs rounded-lg px-2 py-1 outline-none"
          >
            <option value="all">همه</option>
            <option value="approved">تأییدشده</option>
            <option value="pending">در انتظار</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border border-slate-200 rounded-xl overflow-hidden bg-white/70 backdrop-blur-md shadow-[0_4px_18px_rgba(0,0,0,0.05)] text-slate-700">
          <thead>
            <tr className="bg-gradient-to-r from-cyan-50 via-cyan-100 to-cyan-200 text-xs font-semibold border-b border-slate-200/50 text-slate-700">
              <th className="py-3 px-4 text-left">کاربر</th>
              <th className="py-3 px-4 text-left">ایمیل</th>
              <th className="py-3 px-4 text-left">متن</th>
              <th className="py-3 px-4 text-center">وضعیت</th>
              <th className="py-3 px-4 text-center">تاریخ</th>
              <th className="py-3 px-4 text-center pl-6">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filtered.length > 0 ? (
              filtered.map((c) => (
                <tr
                  key={c._id}
                  className="hover:bg-white/90 transition border-b border-slate-200/70"
                >
                  <td className="px-4 py-3">{c.user?.name || "–––"}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {c.user?.email || "–––"}
                  </td>
                  <td className="px-4 py-3 text-sm line-clamp-2 text-slate-700">
                    {c.text}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-[3px] text-xs rounded-full font-semibold ${
                        c.approved
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {c.approved ? "تأییدشده" : "در انتظار"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-slate-500">
                    {new Date(c.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-2">
                    {c.approved ? (
                      <button
                        onClick={() => handleStatusChange(c._id, false)}
                        className="p-2 text-yellow-600 rounded-lg hover:bg-yellow-50 transition-all duration-200 hover:scale-95 hover:opacity-80"
                      >
                        <FiXCircle size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(c._id, true)}
                        className="p-2 text-green-600 rounded-lg hover:bg-green-50 transition-all duration-200 hover:scale-95 hover:opacity-80"
                      >
                        <FiCheckCircle size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(c._id)}
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
                  colSpan={6}
                  className="text-center py-6 text-slate-500 text-sm"
                >
                  {loading ? "در حال بارگذاری..." : "هیچ کامنتی یافت نشد"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {loading ? (
          <div className="text-center py-6 text-slate-500 text-sm">
            در حال بارگذاری...
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((c) => (
            <div
              key={c._id}
              className="bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow border border-slate-200/70"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold text-sm text-slate-800">
                  {c.user?.name || "–––"}
                </h3>
                <span
                  className={`px-2 py-[2px] text-[10px] rounded-full ${
                    c.approved
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {c.approved ? "تأییدشده" : "در انتظار"}
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-1">
                📧 {c.user?.email || "–––"}
              </p>
              <p className="text-[13px] text-slate-700 mb-3 leading-relaxed">
                “{c.text}”
              </p>
              <p className="text-[11px] text-slate-500 mb-3">
                📅 {new Date(c.createdAt).toLocaleDateString("fa-IR")}
              </p>
              <div className="flex justify-end gap-3">
                {c.approved ? (
                  <button
                    onClick={() => handleStatusChange(c._id, false)}
                    className="p-2 text-yellow-600 rounded-lg hover:bg-yellow-50 transition-all"
                  >
                    <FiXCircle size={15} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(c._id, true)}
                    className="p-2 text-green-600 rounded-lg hover:bg-green-50 transition-all"
                  >
                    <FiCheckCircle size={15} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(c._id)}
                  className="p-2 text-red-500 rounded-lg hover:bg-red-50 transition-all"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-slate-500 py-6 text-sm">
            هیچ کامنتی یافت نشد
          </div>
        )}
      </div>
    </div>
  );
}

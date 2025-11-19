"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FiTrash2, FiUserX, FiCheck } from "react-icons/fi";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data: { data: User[] } = await res.json();
    setUsers(data.data || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`حذف کاربر "${name}"؟`)) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      await logAction("DELETE_USER", name);
      fetchUsers();
    }
  };

  const handleBlockToggle = async (
    id: string,
    name: string,
    active: boolean
  ) => {
    const newStatus = !active;
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: newStatus }),
    });
    await logAction(newStatus ? "UNBLOCK_USER" : "BLOCK_USER", name);
    fetchUsers();
  };

  const logAction = async (action: string, entityName: string) => {
    await fetch("/api/admin/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: "مانی ایمانی",
        action,
        entity: "user",
        entityName,
      }),
    });
  };

  return (
    <div className="p-6 font-vazirmatn">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-cyan-700 bg-clip-text text-transparent mb-6">
        مدیریت کاربران
      </h1>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg border border-slate-200">
        <table className="w-full text-sm text-slate-700">
          <thead className="bg-gradient-to-r from-cyan-100 to-cyan-200">
            <tr>
              <th className="px-4 py-3 text-left">نام کامل</th>
              <th className="px-4 py-3 text-left">ایمیل</th>
              <th className="px-4 py-3 text-left">نقش</th>
              <th className="px-4 py-3 text-left">تایید ایمیل</th>
              <th className="px-4 py-3 text-left">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-white/80 transition-all border-b border-slate-200"
              >
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3">
                  {user.verified ? (
                    <span className="text-green-600 font-semibold">
                      تایید شده
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold">
                      نیاز به تایید
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() =>
                      handleBlockToggle(user._id, user.name, user.verified)
                    }
                    className={`p-2 rounded-lg ${
                      user.verified
                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                        : "bg-green-100 text-green-600 hover:bg-green-200"
                    } transition`}
                  >
                    {user.verified ? <FiUserX /> : <FiCheck />}
                  </button>
                  <button
                    onClick={() => handleDelete(user._id, user.name)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

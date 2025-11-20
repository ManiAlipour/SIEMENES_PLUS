"use client";
import { useEffect, useState } from "react";
import { FiTrash2, FiUserX, FiCheck } from "react-icons/fi";
import UsersFilterBar from "@/components/features/dash/admin/UsersFilterBar";

// ---------------------------
// Main Page
// ---------------------------
export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // Fetch all users
  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data: { data: User[] } = await res.json();
    setUsers(data.data || []);
    setFilteredUsers(data.data || []); // default
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ---------------------------
  // Handlers
  // ---------------------------
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
        action,
        entity: "user",
        entityName,
      }),
    });
  };

  // ---------------------------
  // Filter Logic
  // ---------------------------
  const handleSearch = (query: string) => {
    if (!query) return setFilteredUsers(users);
    const q = query.toLowerCase();
    const results = users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
    setFilteredUsers(results);
  };

  const handleFilter = ({
    role,
    sort,
  }: {
    role: string;
    sort: "newest" | "oldest";
  }) => {
    let result = [...users];
    if (role !== "all") result = result.filter((u) => u.role === role);

    result.sort((a, b) =>
      sort === "newest"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    setFilteredUsers(result);
  };

  // Keep filteredUsers synced when users reload
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className="p-6 font-vazirmatn">
      {/* ---- Page Title ---- */}
      <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-cyan-700 bg-clip-text text-transparent mb-4">
        مدیریت کاربران
      </h1>

      {/* ---- Search & Filter ---- */}
      <UsersFilterBar
        onSearch={handleSearch}
        onFilter={handleFilter}
        roles={["admin", "user"]}
      />

      {/* ---- Glass Table ---- */}
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-white/90 transition-all border-b border-slate-200"
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
                      title={user.verified ? "مسدود کردن" : "رفع مسدودی"}
                    >
                      {user.verified ? <FiUserX /> : <FiCheck />}
                    </button>
                    <button
                      onClick={() => handleDelete(user._id, user.name)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      title="حذف کاربر"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-slate-500 py-6 italic"
                >
                  کاربری یافت نشد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

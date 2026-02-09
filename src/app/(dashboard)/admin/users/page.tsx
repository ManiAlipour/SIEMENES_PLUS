"use client";

import { useEffect, useState } from "react";
import UsersFilterBar from "@/components/features/dash/admin/UsersFilterBar";
import { useMediaQuery } from "iso-hooks";
import UsersTableDesktop from "@/components/ui/admin/users/UsersTable.desktop";
import UserCardMobile from "@/components/ui/admin/users/UserCard.mobile";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const isMobile = useMediaQuery("(max-width: 768px)");

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.data || []);
      setFilteredUsers(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Actions
  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const handleBlockToggle = async (id: string, active: boolean) => {
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    fetchUsers();
  };

  // Filters
  const handleSearch = (query: string) => {
    if (!query) return setFilteredUsers(users);
    const q = query.toLowerCase();
    setFilteredUsers(
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      ),
    );
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
        ? +new Date(b.createdAt) - +new Date(a.createdAt)
        : +new Date(a.createdAt) - +new Date(b.createdAt),
    );

    setFilteredUsers(result);
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className="p-4 md:p-6 font-vazirmatn">
      <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-cyan-700 bg-clip-text text-transparent">
        مدیریت کاربران
      </h1>

      <UsersFilterBar
        onSearch={handleSearch}
        onFilter={handleFilter}
        roles={["admin", "user"]}
      />

      {loading ? (
        <p className="text-center py-10 text-slate-500">در حال بارگذاری...</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-center py-10 text-slate-400">کاربری یافت نشد</p>
      ) : isMobile ? (
        <div className="space-y-3 mt-4">
          {filteredUsers.map((user) => (
            <UserCardMobile
              key={user._id}
              user={user}
              onDelete={handleDelete}
              onToggleBlock={handleBlockToggle}
            />
          ))}
        </div>
      ) : (
        <UsersTableDesktop
          users={filteredUsers}
          onDelete={handleDelete}
          onToggleBlock={handleBlockToggle}
        />
      )}
    </div>
  );
}

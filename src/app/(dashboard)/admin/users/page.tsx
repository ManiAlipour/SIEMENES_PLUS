"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Users, UserCheck, UserRoundX, ShieldCheck, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import UsersFilterBar from "@/components/features/dash/admin/UsersFilterBar";
import { useMediaQuery } from "iso-hooks";
import UsersTableDesktop from "@/components/ui/admin/users/UsersTable.desktop";
import UserCardMobile from "@/components/ui/admin/users/UserCard.mobile";
import AdminPageHeading from "@/components/layouts/dash/admin/AdminPageHeading";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [workingId, setWorkingId] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/users", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "دریافت فهرست کاربران انجام نشد.");
      setUsers(result.data || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در دریافت کاربران");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void fetchUsers(); }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fa-IR");
    return users.filter((user) => {
      const matchesRole = role === "all" || user.role === role;
      const matchesSearch = !query || `${user.name} ${user.email}`.toLocaleLowerCase("fa-IR").includes(query);
      return matchesRole && matchesSearch;
    }).sort((a, b) => sort === "newest" ? +new Date(b.createdAt) - +new Date(a.createdAt) : +new Date(a.createdAt) - +new Date(b.createdAt));
  }, [users, search, role, sort]);

  async function mutateUser(id: string, action: "delete" | "toggle", active?: boolean) {
    if (action === "delete" && !window.confirm("این حساب کاربری حذف شود؟")) return;
    setWorkingId(id);
    try {
      const response = await fetch(`/api/admin/users/${id}`, action === "delete" ? { method: "DELETE" } : {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !active }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "عملیات روی کاربر انجام نشد.");
      toast.success(action === "delete" ? "حساب کاربر حذف شد." : active ? "حساب کاربر غیرفعال شد." : "حساب کاربر فعال شد.");
      await fetchUsers();
    } catch (error) { toast.error(error instanceof Error ? error.message : "عملیات انجام نشد."); }
    finally { setWorkingId(null); }
  }

  const totals = useMemo(() => ({ all: users.length, verified: users.filter((user) => user.verified).length, admins: users.filter((user) => user.role === "admin").length }), [users]);
  const filterChange = ({ role: nextRole, sort: nextSort }: { role: string; sort: "newest" | "oldest" }) => { setRole(nextRole); setSort(nextSort); };

  return <main dir="rtl" className="mx-auto max-w-[1440px] space-y-5">
    <AdminPageHeading title="مدیریت کاربران" description="حساب‌ها، سطح دسترسی و وضعیت کاربران فروشگاه را مدیریت کنید." icon={Users} eyebrow="حساب‌ها و دسترسی‌ها" />
    <section className="grid gap-3 sm:grid-cols-3">
      <Summary icon={Users} label="کل کاربران" value={totals.all} tone="blue" />
      <Summary icon={UserCheck} label="حساب‌های فعال" value={totals.verified} tone="green" />
      <Summary icon={ShieldCheck} label="مدیران" value={totals.admins} tone="violet" />
    </section>
    <UsersFilterBar onSearch={setSearch} onFilter={filterChange} roles={["admin", "user"]} />
    {loading ? <div className="flex min-h-52 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm text-slate-500"><LoaderCircle className="animate-spin" size={17} />در حال دریافت کاربران...</div>
      : filteredUsers.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center"><UserRoundX className="mx-auto text-slate-300" size={30} /><p className="mt-3 text-sm font-bold text-slate-600">کاربری با این مشخصات پیدا نشد.</p><button type="button" onClick={() => { setSearch(""); setRole("all"); }} className="mt-2 text-xs font-bold text-blue-700">پاک‌کردن فیلترها</button></div>
      : isMobile ? <div className="space-y-3">{filteredUsers.map((user) => <UserCardMobile key={user._id} user={user} onDelete={(id) => void mutateUser(id, "delete")} onToggleBlock={(id, active) => void mutateUser(id, "toggle", active)} />)}</div>
      : <UsersTableDesktop users={filteredUsers} onDelete={(id) => void mutateUser(id, "delete")} onToggleBlock={(id, active) => void mutateUser(id, "toggle", active)} />}
    {workingId && <span className="sr-only" role="status">در حال انجام عملیات برای کاربر</span>}
  </main>;
}

function Summary({ icon: Icon, label, value, tone }: { icon: typeof Users; label: string; value: number; tone: "blue" | "green" | "violet" }) {
  const colors = { blue: "bg-blue-50 text-blue-700", green: "bg-emerald-50 text-emerald-700", violet: "bg-violet-50 text-violet-700" };
  return <article className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[tone]}`}><Icon size={18} /></span><div><p className="text-[11px] text-slate-500">{label}</p><p className="mt-0.5 text-xl font-black tabular-nums text-slate-900">{value.toLocaleString("fa-IR")}</p></div></article>;
}

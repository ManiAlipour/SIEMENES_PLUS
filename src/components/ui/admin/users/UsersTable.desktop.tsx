import { FiTrash2, FiUserX, FiCheck } from "react-icons/fi";

export default function UsersTableDesktop({
  users,
  onDelete,
  onToggleBlock,
}: {
  users: User[];
  onDelete: (id: string) => void;
  onToggleBlock: (id: string, active: boolean) => void;
}) {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-4 text-right text-xs font-extrabold text-slate-500">نام</th>
            <th className="px-5 py-4 text-right text-xs font-extrabold text-slate-500">ایمیل</th>
            <th className="px-5 py-4 text-center text-xs font-extrabold text-slate-500">نقش</th>
            <th className="px-5 py-4 text-center text-xs font-extrabold text-slate-500">وضعیت حساب</th>
            <th className="px-5 py-4 text-center text-xs font-extrabold text-slate-500">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t border-slate-100 transition hover:bg-slate-50/70">
              <td className="px-5 py-4 font-bold text-slate-800">{u.name}</td>
              <td className="px-5 py-4 text-slate-500">{u.email || "—"}</td>
              <td className="px-5 py-4 text-center"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">{u.role === "admin" ? "مدیر" : "کاربر"}</span></td>
              <td className="px-5 py-4 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    u.active !== false
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {u.active !== false ? "فعال" : "مسدود"}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-center gap-2">
                <button
                  onClick={() => onToggleBlock(u._id, u.active !== false)}
                  aria-label={u.active !== false ? "مسدود کردن کاربر" : "فعال‌کردن کاربر"}
                  className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  {u.verified ? <FiUserX /> : <FiCheck />}
                </button>
                <button
                  onClick={() => onDelete(u._id)}
                  aria-label="حذف کاربر"
                  className="rounded-lg border border-rose-100 bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100"
                >
                  <FiTrash2 />
                </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

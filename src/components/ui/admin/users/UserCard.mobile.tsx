import { FiTrash2, FiUserX, FiCheck } from "react-icons/fi";

export default function UserCardMobile({
  user,
  onDelete,
  onToggleBlock,
}: {
  user: User;
  onDelete: (id: string) => void;
  onToggleBlock: (id: string, active: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="min-w-0">
        <div className="flex items-center gap-2"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-black text-blue-700">{user.name?.trim()?.charAt(0) || "ک"}</span><p className="truncate font-bold text-slate-800">{user.name}</p></div>
        <p className="mt-2 truncate text-xs text-slate-500">{user.email || "ایمیل ثبت نشده"}</p>
        <span
          className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
            user.active !== false
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {user.active !== false ? "فعال" : "مسدود"}
        </span>
      </div>

      <div className="flex shrink-0 flex-col gap-2">
        <button
          onClick={() => onToggleBlock(user._id, user.active !== false)}
          aria-label={user.active !== false ? "مسدود کردن کاربر" : "فعال‌کردن کاربر"}
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
        >
          {user.verified ? <FiUserX /> : <FiCheck />}
        </button>
        <button
          onClick={() => onDelete(user._id)}
          aria-label="حذف کاربر"
          className="rounded-lg border border-rose-100 bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100"
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
}

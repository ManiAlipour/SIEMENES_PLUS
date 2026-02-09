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
    <div className="bg-white rounded-2xl shadow border overflow-hidden mt-4">
      <table className="w-full text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-4 py-3 text-right">نام</th>
            <th className="px-4 py-3 text-right">ایمیل</th>
            <th className="px-4 py-3">نقش</th>
            <th className="px-4 py-3">وضعیت</th>
            <th className="px-4 py-3">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t hover:bg-slate-50 transition">
              <td className="px-4 py-3">{u.name}</td>
              <td className="px-4 py-3">{u.email}</td>
              <td className="px-4 py-3">{u.role}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    u.verified
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {u.verified ? "فعال" : "مسدود"}
                </span>
              </td>
              <td className="px-4 py-3 flex gap-2 justify-center">
                <button
                  onClick={() => onToggleBlock(u._id, u.verified)}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                >
                  {u.verified ? <FiUserX /> : <FiCheck />}
                </button>
                <button
                  onClick={() => onDelete(u._id)}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                >
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

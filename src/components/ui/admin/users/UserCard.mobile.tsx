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
    <div className="bg-white rounded-2xl p-4 shadow border flex justify-between items-center">
      <div>
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm text-slate-500">{user.email}</p>
        <span
          className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
            user.verified
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {user.verified ? "فعال" : "مسدود"}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => onToggleBlock(user._id, user.verified)}
          className="p-2 rounded-lg bg-slate-100"
        >
          {user.verified ? <FiUserX /> : <FiCheck />}
        </button>
        <button
          onClick={() => onDelete(user._id)}
          className="p-2 rounded-lg bg-red-100 text-red-600"
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
}

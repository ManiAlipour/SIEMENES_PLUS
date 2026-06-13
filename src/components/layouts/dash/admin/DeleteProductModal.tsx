"use client";

import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";

export default function DeleteProductModal({
  product,
  onClose,
  onDeleted,
}: {
  product: { _id: string; name: string };
  onClose: () => void;
  onDeleted: () => void;
}) {
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/admin/products/${product._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DELETE_PRODUCT",
          entity: "product",
          entityName: product.name,
        }),
      });

      toast.success("محصول حذف شد 🗑️");
      onDeleted();
      onClose();
    } catch {
      toast.error("خطا در حذف محصول");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[380px]">
        <div className="flex justify-between mb-4">
          <h2 className="font-bold text-red-600">حذف محصول</h2>
          <button onClick={onClose}>
            <FiX />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          آیا از حذف محصول <b>{product.name}</b> مطمئن هستید؟
        </p>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border py-2 rounded">
            انصراف
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white py-2 rounded"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}

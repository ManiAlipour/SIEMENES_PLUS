"use client";

import { useState } from "react";
import { FiBox, FiEdit2, FiTrash2 } from "react-icons/fi";
import { IoMdCheckmark } from "react-icons/io";
import { FaTimesCircle } from "react-icons/fa";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";

interface Product {
  _id: string;
  name: string;
  brand?: string;
  isFeatured?: boolean;
  slug: string;
}

export default function ProductTable({
  products,
  onRefresh,
}: {
  products: Product[];
  onRefresh: () => void;
}) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <div className="mt-12 relative z-10 rounded-2xl bg-white/90 border border-[#e5e7eb]/60 backdrop-blur-xl shadow overflow-hidden font-vazirmatn">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-5 text-right">نام محصول</th>
                <th className="py-3 px-5 text-right">برند</th>
                <th className="py-3 px-5 text-right">ویژه</th>
                <th className="py-3 px-5 text-right">اکشن‌ها</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr
                  key={p._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-5">{p.name}</td>
                  <td className="py-3 px-5">{p.brand || "—"}</td>
                  <td className="py-3 px-5">
                    {p.isFeatured ? <IoMdCheckmark /> : <FaTimesCircle />}
                  </td>
                  <td className="py-3 px-5 flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setIsEditOpen(true);
                      }}
                    >
                      <FiEdit2 />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setIsDeleteOpen(true);
                      }}
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

      {isEditOpen && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setIsEditOpen(false)}
          onUpdated={onRefresh}
        />
      )}

      {isDeleteOpen && selectedProduct && (
        <DeleteProductModal
          product={selectedProduct}
          onClose={() => setIsDeleteOpen(false)}
          onDeleted={onRefresh}
        />
      )}
    </>
  );
}

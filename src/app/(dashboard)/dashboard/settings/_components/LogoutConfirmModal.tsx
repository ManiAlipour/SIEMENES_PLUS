"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function LogoutConfirmModal({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      alert("خطا در خروج از حساب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <Dialog.Title className="font-bold text-lg text-red-600">
              خروج از حساب
            </Dialog.Title>
            <p className="text-gray-600">
              آیا مطمئن هستید که می‌خواهید از حساب خارج شوید؟
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
              >
                انصراف
              </button>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                {loading ? "در حال خروج..." : "تأیید خروج"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}

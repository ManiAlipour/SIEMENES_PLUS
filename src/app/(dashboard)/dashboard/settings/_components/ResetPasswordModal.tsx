"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ResetPasswordModal({ open, onClose }: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("رمز عبور جدید با تکرار آن مطابقت ندارد");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/user/change-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "خطا در تغییر رمز عبور");
      }

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <Dialog.Title className="font-bold text-lg">
              تغییر رمز عبور
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="password"
                placeholder="رمز فعلی"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-cyan-500"
              />
              <input
                type="password"
                placeholder="رمز جدید"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-cyan-500"
              />
              <input
                type="password"
                placeholder="تکرار رمز جدید"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-cyan-500"
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && (
                <p className="text-green-600 text-sm">
                  رمز عبور با موفقیت تغییر کرد.
                </p>
              )}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded-lg"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
                >
                  {loading ? "در حال ارسال..." : "ذخیره"}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}

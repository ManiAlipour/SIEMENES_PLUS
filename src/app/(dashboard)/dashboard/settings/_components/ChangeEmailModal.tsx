"use client";

import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ChangeEmailModal({ open, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("ایمیل معتبر نیست");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/users/change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "خطا در تغییر ایمیل");
      }

      setSuccess(true);

      setTimeout(() => {
        router.push(`/verify?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/40">
            <Dialog.Panel className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-lg">
              <Dialog.Title className="font-bold text-lg">
                تغییر ایمیل
              </Dialog.Title>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="ایمیل جدید"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && (
                  <p className="text-green-600 text-sm">
                    ایمیل با موفقیت تغییر کرد. کدتایید به ایمیل شما فرستاده شد
                    لطفا حساب کاربری خود را تایید کنید.
                  </p>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600"
                  >
                    {loading ? "در حال ارسال..." : "ذخیره"}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

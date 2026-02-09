"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FiAlertTriangle } from "react-icons/fi";

interface Comment {
  _id: string;
  text: string;
  user?: {
    name?: string;
    email?: string;
  };
}

interface Props {
  open: boolean;
  comment: Comment | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteCommentModal({
  open,
  comment,
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  if (!comment) return null;

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center px-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center gap-2 text-red-600 mb-3">
                <FiAlertTriangle className="text-xl" />
                <Dialog.Title className="text-lg font-bold">
                  حذف کامنت
                </Dialog.Title>
              </div>

              <p className="text-sm text-slate-600 mb-3">
                آیا از حذف این کامنت مطمئن هستید؟
                <br />
                <span className="text-red-500 font-medium">
                  این عملیات قابل بازگشت نیست.
                </span>
              </p>

              <div className="border rounded-xl p-3 text-sm bg-slate-50 text-slate-700 line-clamp-3">
                {comment.text}
              </div>

              {comment.user && (
                <div className="mt-2 text-xs text-slate-500">
                  {comment.user.name || "—"} · {comment.user.email || "—"}
                </div>
              )}

              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 transition"
                >
                  انصراف
                </button>

                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-60"
                >
                  {loading ? "در حال حذف..." : "حذف کن"}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

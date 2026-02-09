"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  user?: {
    name?: string;
    email?: string;
  };
}

interface ICommentPreviewModal {
  open: boolean;
  onClose: () => void;
  comment: Comment | null;
}

export default function CommentPreviewModal({
  open,
  onClose,
  comment,
}: ICommentPreviewModal) {
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

        {/* Modal */}
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
            <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              <Dialog.Title className="text-lg font-bold text-slate-800 mb-3">
                متن کامل کامنت
              </Dialog.Title>

              <div className="text-sm text-slate-700 leading-relaxed border rounded-xl p-4 bg-slate-50 max-h-[300px] overflow-y-auto">
                {comment.text}
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition"
                >
                  بستن
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

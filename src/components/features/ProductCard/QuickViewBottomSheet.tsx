"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/data/blog-data"; // Assuming path

interface QuickViewBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  post: BlogPost;
}

export default function QuickViewBottomSheet({
  isOpen,
  onClose,
  post,
}: QuickViewBottomSheetProps) {
  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-end md:items-center p-0 md:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Content */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-t-2xl md:rounded-2xl shadow-2xl transform transition-transform duration-300 animate-in slide-in-from-bottom-10 fade-in max-h-[85vh] overflow-y-auto flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 p-2 bg-white/80 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Quick View Body */}
        <div className="flex flex-col md:flex-row h-full">
          {/* Image Side */}
          <div className="relative w-full md:w-1/2 h-48 md:h-auto shrink-0">
            <Image
              src={post.image || "/placeholder.jpg"}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Info Side */}
          <div className="p-6 flex flex-col gap-4 flex-1">
            <h2 className="text-xl font-bold text-gray-800">{post.title}</h2>
            <div className="prose prose-sm text-gray-600 overflow-y-auto custom-scrollbar">
              <p>{post.description}</p>
              {/* Add more placeholder content or meta info here */}
              <p className="text-xs text-gray-400 mt-2">زمان مطالعه: ۵ دقیقه</p>
            </div>

            <div className="mt-auto pt-4">
              <Link
                href={`/blog/${post.slug}`}
                className="block w-full py-3 bg-primary text-white text-center rounded-lg font-bold hover:bg-primary-dark transition-colors"
              >
                مطالعه کامل مقاله
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";

// کامپوننت پلیر آپارات با کنترل‌های دیفالت
export default function AparatPlayer({
  videoUrl,
  thumbnail, // اختیاری: تصویر کاور
}: {
  videoUrl: string;
  thumbnail?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // mount iframe فقط سمت کلاینت بعد از اولین interaction
    const container = containerRef.current;
    if (!container) return;

    const handleClick = () => {
      // اگر iframe قبلاً ساخته نشده
      if (!iframeRef.current) {
        const iframe = document.createElement("iframe");
        iframe.src = videoUrl;
        iframe.title = "ویدیو آپارات";
        iframe.allow = "autoplay; fullscreen";
        iframe.loading = "lazy";
        iframe.className =
          "w-full h-full rounded-lg border border-gray-200 bg-[#f7f9fb]";
        iframeRef.current = iframe;
        container.innerHTML = ""; // حذف placeholder
        container.appendChild(iframe);
      }
    };

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, [videoUrl]);

  return (
    <div
      className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-[#f7f9fb]
             border border-gray-200 hover:shadow-md transition-all duration-300"
    >
      <iframe
        src={videoUrl}
        title="ویدیو آپارات"
        loading="lazy"
        allow="autoplay; fullscreen"
        className="absolute inset-0 w-full h-full rounded-lg"
      />
    </div>
  );
}

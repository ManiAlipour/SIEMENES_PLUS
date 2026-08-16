"use client";

import { useState } from "react";
import { FiPlay } from "react-icons/fi";

function extractAparatVideoId(url: string): string | null {
  const match = url.match(/aparat\.com\/v\/([a-zA-Z0-9_-]+)/i);
  return match ? match[1] : null;
}

function toAparatIframeUrl(videoOrEmbedUrl: string): string | null {
  if (!videoOrEmbedUrl) return null;
  if (videoOrEmbedUrl.includes("/v/")) {
    const vid = extractAparatVideoId(videoOrEmbedUrl);
    if (vid)
      return `https://www.aparat.com/video/video/embed/videohash/${vid}/vt/frame`;
  }
  if (videoOrEmbedUrl.includes("aparat.com/video/video/embed/videohash/")) {
    return videoOrEmbedUrl;
  }
  return null;
}

export default function AparatPlayer({
  videoUrl,
  title = "ویدیو آپارات",
  autoLoad = false,
}: {
  videoUrl: string;
  thumbnail?: string;
  title?: string;
  /** If false, iframe loads only after user click (better for homepage). */
  autoLoad?: boolean;
}) {
  const embedUrl = toAparatIframeUrl(videoUrl);
  const [loaded, setLoaded] = useState(autoLoad);

  if (!embedUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-200 text-sm text-red-600">
        لینک ویدیوی آپارات معتبر نیست
      </div>
    );
  }

  if (!loaded) {
    return (
      <button
        type="button"
        onClick={() => setLoaded(true)}
        className="group relative flex h-full w-full min-h-[10rem] items-center justify-center bg-[#0b1f33] text-white"
        aria-label={`پخش ${title}`}
      >
        <span
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #004c97 0%, #0b1f33 55%, #003d66 100%)",
          }}
          aria-hidden
        />
        <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-sm transition group-hover:scale-105 group-hover:bg-white/20">
          <FiPlay className="mr-[-2px]" size={22} />
        </span>
      </button>
    );
  }

  return (
    <div className="relative h-full w-full min-h-[10rem] overflow-hidden bg-black">
      <iframe
        src={embedUrl}
        title={title}
        loading="lazy"
        allow="autoplay; fullscreen"
        className="absolute inset-0 h-full w-full"
        allowFullScreen
      />
    </div>
  );
}

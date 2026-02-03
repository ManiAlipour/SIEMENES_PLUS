"use client";

import { useUpdateEffect } from "iso-hooks";
import { useEffect, useEffectEvent, useRef, useState } from "react";

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
}: // thumbnail = "",
{
  videoUrl: string;
  thumbnail?: string;
}) {
  const embedUrl = toAparatIframeUrl(videoUrl);
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  if (!embedUrl) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-slate-200 text-red-600 text-sm rounded-lg border border-gray-200">
        لینک ویدیوی آپارات معتبر نیست
      </div>
    );
  }
  return (
    <div
      className="relative w-full aspect-video rounded-lg overflow-hidden bg-[#f7f9fb]
             border border-gray-200 hover:shadow-md transition-all duration-300"
    >
      <iframe
        src={embedUrl}
        title="ویدیو آپارات"
        loading="lazy"
        allow="autoplay; fullscreen"
        className="absolute inset-0 w-full h-full rounded-lg"
        allowFullScreen
        ref={iframeRef}
      />
    </div>
  );
}

"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface TrackedLinkProps {
  href: string;
  channel: "WHATSAPP" | "TELEGRAM" | "INSTAGRAM" | "CALL";
  productName: string;
  productId: string;
  className?: string;
  target?: string;
  rel?: string;
  children: ReactNode;
  ariaLabel?: string;
}

function sendPriceAction(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);

  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      const queued = navigator.sendBeacon("/api/actions/price", blob);
      if (queued) return;
    }
  } catch {
    // fallback below
  }

  void fetch("/api/actions/price", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch((e) => console.error("tracking failed", e));
}

export default function TrackedLink({
  href,
  channel,
  productName,
  productId,
  className,
  target,
  rel,
  children,
  ariaLabel,
}: TrackedLinkProps) {
  const pathname = usePathname();

  const logAction = () => {
    sendPriceAction({
      productName,
      productId,
      channel,
      meta: {
        pathname,
        referrer: typeof document !== "undefined" ? document.referrer : "",
        source: "product_inquiry_panel",
      },
    });
  };

  return (
    <a
      href={href}
      onClick={logAction}
      className={className}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}

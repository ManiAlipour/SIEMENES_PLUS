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

  const logAction = async () => {
    try {
      await fetch("/api/actions/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          productId,
          channel,
          meta: {
            pathname,
            referrer: document.referrer,
            source: "product_inquiry_panel",
          },
        }),
      });
    } catch (e) {
      console.error("tracking failed", e);
    }
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

"use client";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const record = async () => {
      await fetch("/api/analytics/product-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: window.location.pathname,
          userAgent: navigator.userAgent,
        }),
      });
    };
    record();
  }, [pathname]);
  return <>{children}</>;
}

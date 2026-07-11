"use client";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import { usePathname } from "next/navigation";
import ReduxProvider from "@/store";
import { AuthProvider } from "./AuthProvider";
import { Suspense, useEffect } from "react";
import { ProgressBar } from "./NProgress";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const notHeaderAndFooterPaths = [
    "/login",
    "/register",
    "/verify",
    "/dashboard",
    "/admin",
    "/forgot-password",
    "/reset-password",
  ];

  const excludedAnalyticsPaths = [
    "/login",
    "/register",
    "/verify",
    "/dashboard",
    "/admin",
    "/forgot-password",
    "/reset-password",
    "/shop",
  ];

  const isNotHeaderAndFooter = notHeaderAndFooterPaths.some((path) =>
    pathname.startsWith(path),
  );

  // بررسی اینکه آیا مسیر فعلی جزو لیست استثنای آنالیتیکس هست یا نه
  const isExcludedFromAnalytics = excludedAnalyticsPaths.some((path) =>
    pathname.startsWith(path),
  );

  useEffect(() => {
    // اگر مسیر فعلی جزو استثناها بود، از اجرای تابع خارج شو
    if (isExcludedFromAnalytics) return;

    const record = async () => {
      try {
        await fetch("/api/analytics/pageview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: window.location.pathname,
            userAgent: navigator.userAgent,
          }),
        });
      } catch (error) {
        console.error("Failed to record pageview:", error);
      }
    };

    record();
  }, [pathname, isExcludedFromAnalytics]);

  return (
    <ReduxProvider>
      <AuthProvider>
        <div className="font-vazir">
          {!isNotHeaderAndFooter && <Header />}
          <Suspense fallback={null}>
            <ProgressBar />
          </Suspense>
          {children}
          {!isNotHeaderAndFooter && <Footer />}
        </div>
      </AuthProvider>
    </ReduxProvider>
  );
};

export default Providers;

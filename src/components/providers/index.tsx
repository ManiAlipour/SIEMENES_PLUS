"use client";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import { usePathname } from "next/navigation";
import ReduxProvider from "@/store";
import { AuthProvider } from "./AuthProvider";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const notHeaderAndFooterPaths = [
    "/login",
    "/register",
    "/verify",
    "/dashboard",
    "/admin",
  ];

  const pathname = usePathname();

  const isNotHeaderAndFooter = notHeaderAndFooterPaths.some((path) =>
    pathname.startsWith(path)
  );

  useEffect(() => {
    const record = async () => {
      await fetch("/api/analytics/pageview", {
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

  return (
    <ReduxProvider>
      <AuthProvider>
        <div className="font-vazir">
          {!isNotHeaderAndFooter && <Header />}
          {children}
          {!isNotHeaderAndFooter && <Footer />}
        </div>
      </AuthProvider>
    </ReduxProvider>
  );
};

export default Providers;

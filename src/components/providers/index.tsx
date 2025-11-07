"use client";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import { usePathname } from "next/navigation";
import ReduxProvider from "@/store";
import { AuthProvider } from "./AuthProvider";

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

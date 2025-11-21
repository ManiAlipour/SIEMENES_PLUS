"use client";

import Header from "@/components/layouts/dash/user/Header";
import Sidebar from "@/components/layouts/dash/user/Sidebar";
import { setUser } from "@/store/slices/userSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function DashboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/users/get-one`, {
          method: "GET",
          credentials: "include",
        });

        const user = await res.json();

        dispatch(setUser(user.data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, [dispatch]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Sidebar - Always fixed, hidden on mobile when closed */}
      <Sidebar open={open} onToggleSidebar={() => setOpen(false)} />

      {/* Main Content Container */}
      <div className="flex flex-col flex-1 w-full lg:w-[calc(100%-18rem)]  lg:mr-72 transition-all duration-300">
        <Header onToggleSidebar={() => setOpen(!open)} />
        <main className="flex-1 w-full">{children}</main>
      </div>
    </div>
  );
}

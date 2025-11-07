"use client";

import Header from "@/components/layouts/dash/user/Header";
import Sidebar from "@/components/layouts/dash/user/Sidebar";
import { setUser } from "@/store/slices/userSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function Layout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  // const user = useSelector((state: RootState) => state.user);

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
  }, []);

  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar open={open} onToggleSidebar={() => setOpen(false)} />
      <div className="flex flex-col flex-1 overflow-auto">
        <Header onToggleSidebar={() => setOpen(!open)} />
        <main className="p-6 font-vazir">{children}</main>
      </div>
    </div>
  );
}

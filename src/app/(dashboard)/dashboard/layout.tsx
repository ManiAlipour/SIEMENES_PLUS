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

// function Loading() {
//   return (
//     <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-xl">
//       {/* Spinner */}
//       <div className="relative w-16 h-16">
//         <div className="absolute inset-0 rounded-full border-4 border-t-[#06b6d4] border-b-transparent animate-spin"></div>
//         <div className="absolute inset-[8px] bg-white/60 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.4)]"></div>
//       </div>

//       {/* Text */}
//       <p className="mt-6 text-[#374151] text-sm sm:text-base font-[Vazirmatn] font-semibold tracking-wide">
//         در حال بارگذاری اطلاعات کاربری...
//       </p>

//       {/* زیرنویس نرم */}
//       <p className="mt-2 text-[#06b6d4]/70 text-xs sm:text-sm font-[Vazirmatn]">
//         لطفاً چند لحظه صبر کنید
//       </p>
//     </div>
//   );
// }

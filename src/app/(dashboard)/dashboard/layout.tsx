"use client";

import { RootState } from "@/store";
import { setUser } from "@/store/slices/userSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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

  return <div>{children}</div>;
}

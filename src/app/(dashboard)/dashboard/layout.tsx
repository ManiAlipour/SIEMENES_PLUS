"use client";

import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/users/get-one`, {
          method: "GET",
          credentials: "include",
        });

        // const res = await fetch("/api/users/get-one");
        const user = await res.json();

        setUser(user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, []);

  return <div>{children}</div>;
}

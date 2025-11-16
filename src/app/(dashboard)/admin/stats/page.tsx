"use client";

import { useEffect, useState } from "react";

export default function AdminStatPage() {
  const [stats, setStats] = useState({} as StatsObject);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/analytics`
        );

        const { data } = await response.json();

        setStats(data as StatsObject);

        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  if (!stats) return <div>خطا در دریافت اطلاعات...</div>;

  return (
    <div>
      <p>سلام!</p>
    </div>
  );
}

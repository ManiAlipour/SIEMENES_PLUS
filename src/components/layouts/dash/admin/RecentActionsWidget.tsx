"use client";
import { useEffect, useState } from "react";

export default function RecentActionsWidget() {
  const [actions, setActions] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/actions")
      .then((res) => res.json())
      .then((data) => setActions(data));
  }, []);

  return (
    <div
      className="rounded-2xl border border-slate-200/60 bg-white/75 backdrop-blur-xl 
                    shadow-[0_8px_20px_rgba(0,0,0,0.05)] p-5"
    >
      <h2 className="text-lg font-semibold text-cyan-700 mb-4">
        آخرین فعالیت‌ها
      </h2>
      {actions.length === 0 ? (
        <p className="text-slate-500 text-sm">هنوز فعالیتی ثبت نشده.</p>
      ) : (
        <ul className="space-y-3">
          {actions.map((a, i) => (
            <li
              key={i}
              className="flex justify-between text-sm text-slate-700 
                                   border-b border-slate-100 pb-1 hover:bg-cyan-50/50"
            >
              <span>
                {a.user} — {a.action}
              </span>
              <span className="text-slate-500 text-xs">
                {new Date(a.createdAt).toLocaleString("fa-IR")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

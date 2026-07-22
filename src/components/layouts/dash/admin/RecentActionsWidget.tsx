"use client";

import { useEffect, useState } from "react";

type AdminActionItem = {
  _id?: string;
  user: string;
  action: string;
  entity?: string;
  entityName?: string;
  createdAt: string;
};

export default function RecentActionsWidget() {
  const [actions, setActions] = useState<AdminActionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/actions")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setActions(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-card p-5">
      <h2 className="mb-4 text-base font-bold text-[#0b1f33]">
        آخرین فعالیت‌های ادمین
      </h2>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-[#eef3f8]" />
          ))}
        </div>
      ) : actions.length === 0 ? (
        <p className="text-sm text-[#94a3b8]">هنوز فعالیتی ثبت نشده.</p>
      ) : (
        <ul className="space-y-2">
          {actions.map((a, i) => (
            <li
              key={a._id || i}
              className="flex items-start justify-between gap-3 rounded-xl border border-[#eef3f8] bg-[#f8fafc] px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#334155]">
                  {a.user} — {a.action}
                </p>
                {(a.entity || a.entityName) && (
                  <p className="mt-0.5 truncate text-xs text-[#94a3b8]">
                    {[a.entity, a.entityName].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
              <span className="shrink-0 text-[11px] text-[#94a3b8]">
                {new Date(a.createdAt).toLocaleString("fa-IR")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

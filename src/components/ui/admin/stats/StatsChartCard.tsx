"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
};

export function StatsChartCard({
  title,
  description,
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-gray-50 dark:bg-gray-900/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${className}`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500">
            {description}
          </p>
        </div>
      </div>
      <div className="h-72">{children}</div>
    </div>
  );
}

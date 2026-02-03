"use client";

export function StatsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-40 rounded-lg bg-gray-200 dark:bg-gray-800" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-900/60" />
        <div className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-900/60" />
        <div className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-900/60" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-72 rounded-2xl bg-gray-100 dark:bg-gray-900/60" />
        <div className="h-72 rounded-2xl bg-gray-100 dark:bg-gray-900/60" />
        <div className="h-72 rounded-2xl bg-gray-100 dark:bg-gray-900/60" />
      </div>
    </div>
  );
}


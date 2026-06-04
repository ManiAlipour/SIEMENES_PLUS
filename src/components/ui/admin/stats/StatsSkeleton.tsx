"use client";

export function StatsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-lg bg-slate-200" />
          <div className="h-4 w-72 rounded bg-slate-100" />
        </div>
        <div className="h-9 w-28 rounded-xl bg-slate-100" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-100" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-slate-100" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="h-24 rounded-2xl bg-slate-100" />
        <div className="h-24 rounded-2xl bg-slate-100" />
        <div className="h-24 rounded-2xl bg-slate-100" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-72 rounded-2xl bg-slate-100 lg:col-span-2" />
        <div className="h-72 rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}

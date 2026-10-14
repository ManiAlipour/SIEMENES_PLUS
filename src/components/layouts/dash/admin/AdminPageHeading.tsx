import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  description: string;
  icon: LucideIcon;
  eyebrow?: string;
  actions?: ReactNode;
};

export default function AdminPageHeading({ title, description, icon: Icon, eyebrow = "مدیریت فروشگاه", actions }: Props) {
  return (
    <header className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
      <div className="flex min-w-0 items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-cyan-600 text-white shadow-lg shadow-blue-700/15"><Icon size={21} /></span>
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold tracking-wide text-blue-700">{eyebrow}</p>
          <h1 className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">{title}</h1>
          <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">{description}</p>
        </div>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

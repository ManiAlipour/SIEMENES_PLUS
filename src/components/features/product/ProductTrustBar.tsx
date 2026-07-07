import { FiAward, FiClock, FiHeadphones, FiShield } from "react-icons/fi";

const TRUST_ITEMS = [
  {
    icon: FiShield,
    title: "ضمانت اصالت",
    desc: "کالای اورجینال زیمنس",
  },
  {
    icon: FiHeadphones,
    title: "مشاوره رایگان",
    desc: "پشتیبانی فنی مهندسی",
  },
  {
    icon: FiClock,
    title: "استعلام سریع",
    desc: "پاسخ در کمترین زمان",
  },
  {
    icon: FiAward,
    title: "تجربه تخصصی",
    desc: "سال‌ها فعالیت در صنعت",
  },
] as const;

export default function ProductTrustBar() {
  return (
    <ul className="grid grid-cols-2 gap-3">
      {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
        <li
          key={title}
          className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/80 p-3.5 shadow-sm"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800">{title}</p>
            <p className="text-[11px] leading-5 text-slate-500">{desc}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

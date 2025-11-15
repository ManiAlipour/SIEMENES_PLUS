"use client";

interface IInfoCardProps {
  title: string;
  desc: string;
  count: number;
  color: "primary" | "warn" | "danger" | "success";
}

export default function InfoCard({
  title,
  desc,
  count,
  color,
}: IInfoCardProps) {
  const colors = {
    primary: "#06b6d4",
    warn: "#f59e0b",
    danger: "#ef4444",
    success: "#10b981",
  };

  return (
    <div
      className="flex flex-col justify-between rounded-2xl p-5 shadow-xl
                 backdrop-blur-xl bg-white/10 border border-slate-300/20
                 hover:bg-white/20 transition-all duration-300 min-h-[140px]"
      style={{
        borderTopColor: colors[color],
        borderTopWidth: "3px",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[16px] font-semibold text-slate-800  tracking-tight">
          {title}
        </h3>

        <span
          className="text-[22px] font-bold drop-shadow"
          style={{ color: colors[color] }}
        >
          {count}
        </span>
      </div>

      {/* Description */}
      <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
        {desc}
      </p>

      {/* Accent Bar */}
      <div
        className="self-start mt-3 h-[3px] rounded-full w-[40%] transition-all duration-300"
        style={{ backgroundColor: colors[color] }}
      ></div>
    </div>
  );
}

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
  const colorMap = {
    primary: "from-primary to-[#0e7490]",
    warn: "from-[#f59e0b] to-[#b45309]",
    danger: "from-[#ef4444] to-[#7f1d1d]",
    success: "from-[#10b981] to-[#065f46]",
  };

  return (
    <div
      className={`flex flex-col justify-between rounded-2xl p-5 min-h-[140px]
                  backdrop-blur-xl bg-white/70 border border-[#e5e7eb]/50
                  shadow-[0_2px_12px_rgba(0,0,0,0.06)]
                  hover:shadow-[0_4px_20px_rgba(6,182,212,0.25)]
                  hover:scale-[1.02] transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[16px] font-semibold text-[#1f2937] tracking-tight">
          {title}
        </h3>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center
                      bg-linear-to-br ${colorMap[color]}
                      text-white font-extrabold text-[18px]
                      shadow-[inset_0_0_10px_rgba(255,255,255,0.5)]`}
        >
          {count}
        </div>
      </div>

      {/* Description */}
      <p className="text-[13px] text-meuted leading-relaxed mt-auto">{desc}</p>

      {/* Accent bar */}
      <div
        className={`mt-4 h-[3px] w-[40%] rounded-full bg-linear-to-r ${colorMap[color]} transition-all duration-300`}
      ></div>
    </div>
  );
}

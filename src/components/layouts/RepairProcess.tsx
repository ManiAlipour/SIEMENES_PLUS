import Link from "next/link";
import {
  FiTool,
  FiSearch,
  FiCheckCircle,
  FiTruck,
  FiDroplet,
  FiClipboard,
} from "react-icons/fi";

const steps = [
  { icon: FiClipboard, title: "برآورد هزینه قبل از تعمیر" },
  { icon: FiTool, title: "تعمیر تخصصی و مهندسی" },
  { icon: FiDroplet, title: "سرویس و شستشوی الکترونیکی" },
  { icon: FiSearch, title: "آنالیز و عیب‌یابی قطعات" },
  { icon: FiCheckCircle, title: "تست نهایی محصول" },
  { icon: FiTruck, title: "ارسال مطمئن" },
] as const;

export default function RepairProcess() {
  return (
    <section
      className="relative overflow-hidden bg-[#0b1f33] py-16 text-white md:py-20"
      aria-labelledby="repair-process-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <header className="mb-10 max-w-xl md:mb-14">
          <p className="mb-2 text-xs font-bold tracking-[0.18em] text-[#7ec8e3]">
            خدمات تعمیرات
          </p>
          <h2
            id="repair-process-heading"
            className="text-2xl font-black leading-tight md:text-3xl"
          >
            فرآیند تعمیرات گروه مهندسی زیمنس پلاس
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/65 md:text-base">
            از برآورد هزینه تا تست نهایی — شفاف، تخصصی و قابل پیگیری.
          </p>
        </header>

        <ol className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
          {steps.map((item, i) => {
            const Icon = item.icon;
            return (
              <li key={item.title} className="relative">
                <div className="mb-3 flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#7ec8e3]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-white/15" aria-hidden />
                </div>
                <Icon className="mb-3 h-6 w-6 text-white/90" aria-hidden />
                <p className="text-sm font-medium leading-6 text-white/85">
                  {item.title}
                </p>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 md:mt-12">
          <Link
            href="/contact-us"
            className="inline-flex min-h-[44px] items-center border border-white/30 px-6 text-sm font-bold text-white transition hover:bg-white hover:text-[#0b1f33]"
          >
            درخواست تعمیرات
          </Link>
        </div>
      </div>
    </section>
  );
}

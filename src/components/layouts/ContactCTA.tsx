import { Instagram, PhoneCall } from "lucide-react";

export default function ContactCTA() {
  return (
    <section className="relative w-full py-16 lg:py-20 bg-slate-50 overflow-hidden">
      {/* Decorative background */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#06b6d4 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="pointer-events-none absolute -top-10 -left-10 w-44 h-44 rounded-full bg-cyan-400/10 blur-2xl -z-10" />
      <div className="pointer-events-none absolute -bottom-14 -right-14 w-52 h-52 rounded-full bg-blue-400/10 blur-3xl -z-10" />

      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-100 bg-white px-4 py-10 md:py-16 shadow-2xl shadow-slate-200/50 flex flex-col items-center text-center gap-6 relative z-10">
        {/* Headline */}
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 leading-relaxed">
          برای اطلاع از قیمت‌ها،{" "}
          <span className="text-cyan-600 font-black">با ما در تماس باشید</span>
        </h2>
        {/* Subline */}
        <p className="text-slate-500 text-base mb-6 max-w-xl mx-auto">
          مشاوره تخصصی، تحلیل نیاز شما و اعلام هزینه به صورت شفاف و سریع از طریق
          تماس یا شبکه‌های اجتماعی.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2 w-full">
          {/* Phone */}
          <a
            href="tel:09199883772"
            className="flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 px-7 py-3 text-base font-bold text-white shadow transition duration-150 outline-none ring-cyan-500/50 focus-visible:ring-4"
            style={{ direction: "ltr" }}
          >
            <PhoneCall size={18} />
            <span className="font-mono">0919 988 3772</span>
            <span className="hidden sm:inline">| تماس تلفنی</span>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/siemens.plus1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-cyan-200 px-7 py-3 text-base font-bold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 transition duration-150 shadow"
          >
            <Instagram size={18} className="text-cyan-600" />
            @siemens.plus1
          </a>
        </div>
      </div>
    </section>
  );
}

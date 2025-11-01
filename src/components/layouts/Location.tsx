import { MdLocationOn } from "react-icons/md";

export default function LocationSection() {
  return (
    <section
      id="location"
      className="relative bg-[#f6f8fa] py-24 px-4 md:px-8 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* ---------- Text / Info ---------- */}
        <div className="relative z-20">
          <div className="flex items-center gap-2 mb-4">
            <MdLocationOn className="text-4xl text-[#00A9E0] drop-shadow-[0_0_8px_#00A9E0]" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#004c97] tracking-tight">
              موقعیت مکانی <span className="text-[#00A9E0]">زیمنس‌پلاس</span>
            </h2>
          </div>

          <div
            className="h-[3px] w-28 bg-linear-to-r from-[#00A9E0] via-[#00CFB9] to-[#00A9E0] mb-6
           rounded-full opacity-70"
          ></div>

          <p className="text-gray-600 text-[15px] md:text-[16px] leading-relaxed mb-5">
            قزوین – شهر صنعتی البرز، خیابان زکریای رازی، جنب شرکت مهرام، پلاک ۲۰
          </p>

          <p className="text-[#004c97] font-semibold text-[15px]">
            <span className="text-[#00A9E0]">📞</span> ۰۲۸‑۳۲۲۴۵۶۷۸
          </p>

          <p className="text-[#004c97] font-semibold text-[15px]">
            <span className="text-[#00A9E0]">🕒</span> ساعت کاری: ۹ صبح تا ۵ عصر
          </p>
        </div>

        {/* ---------- Map Panel ---------- */}
        <div className="relative rounded-[14px] overflow-hidden">
          {/* Frame Glow */}
          <div className="absolute inset-0 bg-[#0b1730]/85 backdrop-blur-md rounded-[14px] border border-[#00A9E0]/40 shadow-[inset_0_0_40px_rgba(0,169,224,0.25)] pointer-events-none"></div>

          {/* Top glow pulse */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-linear-to-r from-transparent via-[#00CFB9] to-transparent animate-pulse opacity-75 pointer-events-none"></div>

          {/* Grid overlay */}
          <div
            className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[36px_36px]
           pointer-events-none rounded-[14px]"
          ></div>

          {/* --- MAP --- */}
          <iframe
            title="siemensplus-map"
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d284.57077922117645!2d50.088454345482525!3d36.20180397222579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1zICAg2YLYstmI24zZhtiMINi02YfYsSDYtdmG2LnYqtuMINin2YTYqNix2LLYjCDYrtuM2KfYqNin2YYg2LLaqdix24zYp9uMINix2KfYstuM2Iwg2KzZhtioINi02LHaqdiqINmF2YfYsdin2YXYjCDZvtmE2KfaqSDbstuw!5e0!3m2!1sfa!2s!4v1761992148931!5m2!1sfa!2s"
            className="relative z-10 w-full h-[360px] grayscale-25 hover:grayscale-0 transition-all duration-700 border
             border-[#004c97]/20 rounded-[14px]"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-[#004c97]/30 via-transparent to-transparent
         pointer-events-none"
      ></div>
    </section>
  );
}

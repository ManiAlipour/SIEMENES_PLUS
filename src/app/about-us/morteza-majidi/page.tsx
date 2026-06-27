import React from "react";
import Image from "next/image";
import { Phone, Globe, Instagram, Mail, ChevronLeft } from "lucide-react";

const MortezaProfile = () => {
  return (
    <div className="min-h-screen bg-[#f4f7f9] text-[#333] pb-20" dir="rtl">
      {/* هدر */}
      <div className="bg-[#003d66] text-white py-16 px-4 border-b-4 border-[#00a1b0]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-gray-200">
            <Image
              src="/images/profile/morteza-majidi.webp"
              alt="مرتضی مجیدی"
              fill
              className="object-cover"
            />
          </div>

          <div className="text-center md:text-right flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              مرتضی مجیدی
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed font-medium">
              مهندس الکترونیک و متخصص ارشد عیب‌یابی و
              <br />
              تعمیرات سیستم‌های کنترل CNC
            </p>
            <p className="text-lg mt-2 text-[#00a1b0] font-bold">
              زیمنس ( Siemens CNC Specialist )
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* سایدبار */}
          <div className="space-y-6">
            {/* تماس */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-[#003d66]">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#003d66]">
                اطلاعات تماس
              </h3>

              <div className="space-y-4 text-gray-700">
                <a
                  href="tel:09199883772"
                  className="flex items-center gap-3 hover:text-blue-600 transition-colors"
                >
                  <div className="bg-blue-50 p-2 rounded-lg text-[#003d66]">
                    <Phone size={20} />
                  </div>
                  <span className="font-bold text-lg">۰۹۱۹۹۸۸۳۷۷۲</span>
                </a>

                <a
                  href="https://www.siemensplus1.ir"
                  className="flex items-center gap-3 hover:text-blue-600 transition-colors"
                >
                  <div className="bg-blue-50 p-2 rounded-lg text-[#003d66]">
                    <Globe size={20} />
                  </div>
                  <span className="font-medium">www.siemensplus1.ir</span>
                </a>

                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg text-[#003d66]">
                    <Instagram size={20} />
                  </div>
                  <span className="font-medium">@siemens.plus1</span>
                </div>
              </div>
            </div>

            {/* مهارت‌ها */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-[#003d66] border-b pb-2">
                مهارت ها
              </h3>

              <ul className="space-y-3">
                {[
                  "عیب یابی",
                  "مدیریت پروژه",
                  "پشتیبانی",
                  "کارشناسی در زمینه فروش تجهیزات زیمنس",
                  "راه اندازی ماشین آلات صنعتی",
                ].map((skill, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-gray-700 font-medium"
                  >
                    <ChevronLeft
                      size={18}
                      className="text-[#00a1b0] mt-1 shrink-0"
                    />
                    <span>- {skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* زبان‌ها */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-[#003d66]">زبان‌ها</h3>

              <p className="font-bold text-[#003d66] mb-4">انگلیسی</p>

              {[
                { label: "خواندن", percent: 100 },
                { label: "نوشتن", percent: 60 },
                { label: "مکالمه", percent: 40 },
              ].map((lang) => (
                <div key={lang.label} className="mb-5">
                  <div className="flex justify-between text-sm mb-2 text-gray-700 font-medium">
                    <span>{lang.label}</span>
                    <span className="text-[#003d66] font-bold">
                      {lang.percent}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200/70 rounded-full h-4 relative overflow-hidden">
                    <div
                      className="h-4 rounded-full bg-gradient-to-l from-[#003d66] to-[#00a1b0] shadow-md transition-all duration-700 ease-out flex items-center justify-end pr-2"
                      style={{ width: `${lang.percent}%` }}
                    >
                      {lang.percent > 25 && (
                        <span className="text-[10px] text-white font-bold">
                          {lang.percent}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* محتوای اصلی */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-extrabold text-white bg-[#003d66] -mx-8 -mt-8 p-4 rounded-t-xl mb-8">
                سوابق شغلی
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-[#003d66] mb-3">
                    تسلط بر کنترلرهای سری:
                  </h3>

                  <p className="text-lg leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg border-r-4 border-[#00a1b0]">
                    840D (Pro/sl), 810D, 802D, 828D, 808D.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#003d66] mb-3">
                    تخصص در سخت‌افزار:
                  </h3>

                  <ul className="space-y-2 text-lg text-gray-700 pr-4">
                    <li className="font-bold">• تعمیرات تخصصی ماژول‌های NCU</li>
                    <li className="text-gray-600 mr-4">سری ۵۷۱ تا ۵۷۳ ، CCU</li>
                    <li className="font-bold">
                      • درایوهای سری ۶۱۱ و پنل‌های MMC/MCP
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-xl font-bold text-[#003d66] mb-4">
                    تجربه در ماشین‌آلات سنگین:
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-[#00a1b0] mt-2 shrink-0" />
                      <p className="text-lg">
                        راه اندازی و <strong>Retrofit</strong> دستگاه‌های
                        چندمحوره (تا ۲۲ محور)
                      </p>
                    </div>

                    <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-[#00a1b0] mt-2 shrink-0" />
                      <p className="text-lg">
                        از برندهای معتبر ماشین‌سازی مثل
                        <strong> DMG Mori </strong>،
                        <strong> Zimmermann </strong>و{" "}
                        <strong> Siemens </strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortezaProfile;

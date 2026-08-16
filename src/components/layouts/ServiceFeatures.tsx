import {
  FiShield,
  FiTruck,
  FiHeadphones,
  FiCreditCard,
} from "react-icons/fi";

const features = [
  {
    icon: FiTruck,
    title: "ارسال سریع",
    desc: "تحویل به سراسر کشور در کوتاه‌ترین زمان",
  },
  {
    icon: FiShield,
    title: "ضمانت اصالت",
    desc: "محصولات اورجینال با گارانتی معتبر",
  },
  {
    icon: FiCreditCard,
    title: "پرداخت امن",
    desc: "خرید امن با کارت‌های عضو شتاب",
  },
  {
    icon: FiHeadphones,
    title: "پشتیبانی فنی",
    desc: "مشاوره تخصصی قبل و بعد از خرید",
  },
] as const;

export default function ServiceFeatures() {
  return (
    <section
      className="border-y border-white/10 bg-primary"
      aria-labelledby="service-features-heading"
    >
      <h2 id="service-features-heading" className="sr-only">
        مزایای خدمات زیمنس پلاس
      </h2>
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-x-reverse divide-white/10 lg:grid-cols-4 lg:divide-x-0">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className={`flex items-start gap-3 px-4 py-7 sm:gap-4 sm:px-6 sm:py-8 ${
                i >= 2 ? "border-t border-white/10 lg:border-t-0" : ""
              } ${i % 2 === 1 ? "" : ""} lg:border-l lg:border-white/10 lg:first:border-l-0`}
            >
              <Icon
                className="mt-0.5 h-5 w-5 shrink-0 text-white/80 sm:h-6 sm:w-6"
                aria-hidden
              />
              <div>
                <h3 className="text-sm font-bold text-white sm:text-base">
                  {f.title}
                </h3>
                <p className="mt-1 text-xs leading-6 text-white/65 sm:text-sm">
                  {f.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

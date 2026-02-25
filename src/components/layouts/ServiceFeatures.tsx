export default function ServiceFeatures() {
  const features = [
    {
      icon: "🛒",
      title: "تحویل سریع",
      desc: "ارسال فوری در سریع‌ترین زمان ممکن به سراسر کشور",
    },
    {
      icon: "✅",
      title: "ضمانت اصالت کالا",
      desc: "تمامی محصولات دارای گارانتی اصلی و تأیید شده",
    },
    {
      icon: "💳",
      title: "پرداخت امن",
      desc: "امکان پرداخت امن با تمام کارت‌های عضو شتاب",
    },
    {
      icon: "📞",
      title: "پشتیبانی ۲۴ ساعته",
      desc: "پشتیبانی تخصصی در تمام روزهای هفته",
    },
  ];

  return (
    <section
      className="bg-primary py-10 sm:py-12"
      aria-labelledby="service-features-heading"
    >
      <h2 id="service-features-heading" className="sr-only">
        مزایای خدمات زیمنس پلاس
      </h2>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center bg-primary/80 text-gray-100 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-200 border border-white/10 p-4 sm:p-6"
          >
            <div className="text-3xl sm:text-4xl text-highlight mb-2 sm:mb-3" aria-hidden>
              {f.icon}
            </div>
            <h3 className="text-sm sm:text-lg font-bold mb-1 sm:mb-2 text-white">
              {f.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

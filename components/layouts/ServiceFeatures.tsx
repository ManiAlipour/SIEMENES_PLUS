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
    <section className="bg-[#004c97] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center bg-[#002b59] text-gray-100 rounded-lg shadow-md 
                       hover:shadow-blue-600/40 transition-all duration-200 border border-slate-700 p-3 sm:p-5"
          >
            <div className="text-3xl sm:text-4xl text-[#00a9e0] mb-2 sm:mb-3">
              {f.icon}
            </div>
            <h3 className="text-sm sm:text-lg font-bold mb-1 sm:mb-2">
              {f.title}
            </h3>
            <p className="text-[11px] sm:text-sm text-gray-300 leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

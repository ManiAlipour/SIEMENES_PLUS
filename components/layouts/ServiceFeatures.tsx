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
      desc: "تمامی محصولات دارای گارانتی اصلی و تایید شده",
    },
    {
      icon: "💳",
      title: "پرداخت امن",
      desc: "امکان پرداخت امن با تمامی کارت‌های عضو شتاب",
    },
    {
      icon: "📞",
      title: "پشتیبانی ۲۴ ساعته",
      desc: "پشتیبانی تخصصی در تمام روزهای هفته",
    },
  ];

  return (
    <section className="bg-[#004c97] py-10">
      <div className="max-w-7xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center bg-[#002b59] text-gray-100 rounded-xl shadow-md hover:shadow-blue-600/40 transition-all duration-200 border border-slate-700 p-6"
          >
            <div className="text-4xl text-[#00a9e0] mb-3">{f.icon}</div>
            <h3 className="text-lg font-bold mb-2">{f.title}</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

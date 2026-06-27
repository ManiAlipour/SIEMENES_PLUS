import { Phone, Mail, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";

const contactInfo = [
  {
    Icon: Phone,
    label: "تلفن",
    value: "09199883772",
    color: "from-blue-500 to-blue-600",
  },
  {
    Icon: Mail,
    label: "ایمیل",
    value: "siemensplus8020@gmail.com",
    color: "from-purple-500 to-purple-600",
  },
  {
    Icon: MapPin,
    label: "آدرس",
    value:
      "قزوین، شهر صنعتی البرز، خیابان زکریای رازی، جنب شرکت مهرام، پلاک ۲۰",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    Icon: Clock,
    label: "ساعات کاری",
    value: "۹ صبح تا ۵ عصر (شنبه تا چهارشنبه)",
    color: "from-amber-500 to-amber-600",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen font-vazir bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <section className="py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
          تماس با ما
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          تیم فنی و مهندسی زیمنس پلاس همیشه آماده پاسخ‌گویی به پرسش‌ها و
          همکاری‌های صنعتی شماست.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16 grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {contactInfo.map((info) => {
            const Icon = info.Icon;

            return (
              <div
                key={info.label}
                className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-xl transition"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-4 rounded-xl bg-gradient-to-br ${info.color}`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {info.label}
                    </h3>
                    <p className="text-gray-600 text-sm">{info.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <ContactForm />
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl">
          <h3 className="text-2xl font-bold mb-6">دفتر مرکزی Siemens Plus</h3>

          <div className="rounded-2xl overflow-hidden border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3219.575954852423!2d50.09012632451797!3d36.20119341332384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8cad00694365bb%3A0x7d9345082453edbd!2z2LLbjNmF2YbYsyDZvtmE2KfYsw!5e0!3m2!1sfa!2s!4v1781771002106!5m2!1sfa!2s"
              className="w-full h-[400px] md:h-[500px]"
              loading="lazy"
              allowFullScreen
              title="نقشه دفتر مرکزی زیمنس پلاس"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

import { FiPhone } from "react-icons/fi";

export default function ContactCTA() {
  return (
    <section
      className="bg-primary"
      aria-labelledby="contact-cta-heading"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:py-14">
        <div className="max-w-xl">
          <h2
            id="contact-cta-heading"
            className="text-xl font-black text-white md:text-2xl"
          >
            برای استعلام قیمت محصولات زیمنس با ما تماس بگیرید
          </h2>
          <p className="mt-2 text-sm leading-7 text-white/70">
            مشاوره فنی، بررسی نیاز پروژه و اعلام هزینه به‌صورت شفاف.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a
            href="tel:09199883772"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 bg-white px-6 text-sm font-bold text-primary transition hover:bg-slate-100"
            style={{ direction: "ltr" }}
            aria-label="تماس تلفنی"
          >
            <FiPhone size={16} aria-hidden />
            0919 988 3772
          </a>
          <a
            href="https://instagram.com/siemens.plus1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center border border-white/40 px-6 text-sm font-bold text-white transition hover:bg-white/10"
          >
            اینستاگرام
          </a>
        </div>
      </div>
    </section>
  );
}

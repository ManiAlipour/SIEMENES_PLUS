export type Slide = {
  id: number;
  title: string;
  highlight: string;
  description: string;
  image: string;
  align: "left" | "right";
  href: string;
  cta: string;
};

export const SLIDES: Slide[] = [
  {
    id: 1,
    title: "زیمنس پلاس",
    highlight:
      "تأمین و فروش تجهیزات اصلی زیمنس با ضمانت اصالت و پشتیبانی فنی مهندسی.",
    description:
      "فروش تجهیزات اصلی SIEMENS به همراه ضمانت اصالت و راه‌اندازی همراه با پشتیبانی تخصصی",
    image: "/images/hero2.webp",
    align: "left", // was "right"
    href: "/shop",
    cta: "ورود به فروشگاه",
  },
  {
    id: 2,
    title: "تعمیرات تخصصی زیمنس",
    highlight:
      "عیب‌یابی و تعمیر کنترل، درایو، موتور، انکودر و خط‌کش‌های صنعتی زیمنس.",
    description:
      "تعمیرات تخصصی سیستم‌های Siemens: کنترل، درایور، موتور، انکودر، خط‌کش و ...",
    image: "/images/hero1.webp",
    align: "right", // was "left"
    href: "/contact-us",
    cta: "درخواست پشتیبانی",
  },
];

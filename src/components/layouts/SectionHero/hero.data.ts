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
    title: "فروشگاه زیمنس پلاس",
    highlight: "فروش و تامین محصولات زیمنس",
    description: 
    "فروش تجهیزات اصلی SIEMENS به همراه ضمانت اصالت و راه اندازی همراه با پشتیبانی تخصصی",
    image: "/images/hero2.webp",
    align: "right",
    href: "/shop",
    cta: "مشاهده محصولات زیمنس",
  },
  {
    id: 2,
    title: "تعمیر و نگهداری تجهیزات زیمنس",
    highlight: "پشتیبانی فنی و مهندسی",
    description:
      "تعمیرات تخصصی سیستم‌های Siemens: کنترل، درایور، موتور، انکودر، خط‌کش و ...",
    image: "/images/hero1.webp",
    align: "left",
    href: "/contact-us",
    cta: "تماس با ما",
  },
];

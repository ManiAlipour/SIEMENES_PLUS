export type BlogPost = {
  id: number | string;
  title: string;
  description: string;
  slug: string;
  image?: string;
  videoUrl?: string;
};

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "راهنمای تنظیم PLC زیمنس",
    description:
      "آموزش راه‌اندازی اولیه و تست ورودی‌های دیجیتال با نرم‌افزار TIA Portal.",
    slug: "siemens-plc-guide",
    videoUrl:
      "https://www.aparat.com/video/video/embed/videohash/pmbJx/vt/frame",
  },
  {
    id: 2,
    title: "آشنایی با درایو G120",
    description: "نمای کلی پارامترها و تنظیمات راه‌اندازی موتور سه‌فاز.",
    slug: "g120-drive-overview",
    image: "/images/blog/drives-compare.png",
  },
];

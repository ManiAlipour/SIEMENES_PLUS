import { MonthlyView } from "@/components/ui/admin/stats/StatsCharts";

/**
 * تولید داده‌های نمونه ماهانه برای نمایش در نمودارها
 */
export function generateFakeMonthlyData(): MonthlyView[] {
  const months = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  return months.map((m) => ({
    month: m,
    views: Math.floor(800 + Math.random() * 3000),
  }));
}

/**
 * بررسی اعتبار داده‌های ماهانه
 */
export function isValidMonthlyData(data?: MonthlyView[]): boolean {
  if (!data || data.length === 0) return false;
  return data.some((i) => i.views > 0);
}

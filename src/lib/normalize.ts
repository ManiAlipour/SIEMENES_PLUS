const MONTHS = [
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

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min;

export function normalizeMonthlyViews(data: any[]) {
  const map = new Map(data.map((d) => [d.month, d.views]));

  return MONTHS.map((m) => ({
    month: m,
    views: map.get(m) ?? rand(200, 700),
    _fake: !map.has(m),
  }));
}

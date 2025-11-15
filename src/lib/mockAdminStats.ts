export const monthlyStats = [
  { month: "فروردین", users: 320, products: 45, orders: 15, tickets: 3 },
  { month: "اردیبهشت", users: 410, products: 52, orders: 19, tickets: 4 },
  { month: "خرداد", users: 580, products: 78, orders: 28, tickets: 6 },
  { month: "تیر", users: 502, products: 63, orders: 22, tickets: 5 },
  { month: "مرداد", users: 615, products: 88, orders: 34, tickets: 7 },
  { month: "شهریور", users: 742, products: 104, orders: 39, tickets: 8 },
];

// داده خلاصه برای کارت‌های Trend (رشد نسبت به ماه گذشته)
export const adminTrendStats = {
  usersGrowth: (((742 - 615) / 615) * 100).toFixed(1), // درصد رشد کاربران
  productGrowth: (((104 - 88) / 88) * 100).toFixed(1), // رشد محصولات
  orderGrowth: (((39 - 34) / 34) * 100).toFixed(1), // رشد سفارشات
  ticketGrowth: (((8 - 7) / 7) * 100).toFixed(1), // رشد تیکت‌ها
};

// داده آماری کلی (برای InfoCardها)
export const adminOverview = {
  totalUsers: 742,
  totalProducts: 128,
  totalOrders: 37,
  totalTickets: 12,
};

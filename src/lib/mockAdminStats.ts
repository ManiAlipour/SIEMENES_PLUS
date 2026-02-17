export const monthlyStats = [
  { month: "فروردین", users: 320, products: 45, orders: 15, tickets: 3 },
  { month: "اردیبهشت", users: 410, products: 52, orders: 19, tickets: 4 },
  { month: "خرداد", users: 580, products: 78, orders: 28, tickets: 6 },
  { month: "تیر", users: 502, products: 63, orders: 22, tickets: 5 },
  { month: "مرداد", users: 615, products: 88, orders: 34, tickets: 7 },
  { month: "شهریور", users: 742, products: 104, orders: 39, tickets: 8 },
];

// Trend card data (growth vs previous month)
export const adminTrendStats = {
  usersGrowth: (((742 - 615) / 615) * 100).toFixed(1),
  productGrowth: (((104 - 88) / 88) * 100).toFixed(1),
  orderGrowth: (((39 - 34) / 34) * 100).toFixed(1),
  ticketGrowth: (((8 - 7) / 7) * 100).toFixed(1),
};

// Overview stats for InfoCards
export const adminOverview = {
  totalUsers: 742,
  totalProducts: 128,
  totalOrders: 37,
  totalTickets: 12,
};

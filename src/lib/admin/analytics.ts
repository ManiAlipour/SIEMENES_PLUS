import PageView from "@/models/PageView";
import ProductView from "@/models/ProductView";
import UserSession from "@/models/UserSession";
import SearchQuery from "@/models/SearchQuery";
import InteractionLog from "@/models/InteractionLog";
import { connectDB } from "@/lib/db";
import { adminOnly } from "@/lib/middlewares/adminOnly";

const MONTH_NAMES = [
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

// Map Gregorian month (1–12) to Persian month index in MONTH_NAMES (0–11)
// Persian year starts around March 21st (1st of Farvardin)
const GREGORIAN_TO_JALALI_MONTH_INDEX: number[] = [
  9,  // Jan -> Dey
  10, // Feb -> Bahman
  11, // Mar -> Esfand
  0,  // Apr -> Farvardin
  1,  // May -> Ordibehesht
  2,  // Jun -> Khordad
  3,  // Jul -> Tir
  4,  // Aug -> Mordad
  5,  // Sep -> Shahrivar
  6,  // Oct -> Mehr
  7,  // Nov -> Aban
  8,  // Dec -> Azar
];

const currentMonthIndex = new Date().getMonth();

export async function getAdminAnalytics() {
  await connectDB();

  // --------------------------
  // 1) Page Views
  // --------------------------
  const pageViewsMonthly = await PageView.aggregate([
    {
      $group: {
        _id: { month: { $month: "$timestamp" } },
        total: { $sum: 1 },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]);

  const monthlyViews = pageViewsMonthly.map((item) => {
    const gregMonth: number = item._id.month; // 1..12
    const jalaliIndex =
      GREGORIAN_TO_JALALI_MONTH_INDEX[gregMonth - 1] ?? gregMonth - 1;

    return {
      month: MONTH_NAMES[jalaliIndex],
      views: item.total,
    };
  });

  // --------------------------
  // 2) Product Views
  // --------------------------
  const popularProducts = await ProductView.aggregate([
    {
      $group: {
        _id: "$productId",
        views: { $sum: 1 },
      },
    },
    { $sort: { views: -1 } },
    { $limit: 10 },
  ]);

  // --------------------------
  // 2.1) Top Pages
  // --------------------------
  const topPages = await PageView.aggregate([
    {
      $group: {
        _id: "$url",
        total: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
    { $limit: 8 },
  ]);

  // --------------------------
  // 3) Daily Active Users
  // --------------------------
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const activeUsersDaily = await UserSession.countDocuments({
    loginAt: { $gte: oneDayAgo },
  });

  // --------------------------
  // 4) Monthly Active Users
  // --------------------------
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const activeUsersMonthly = await UserSession.countDocuments({
    loginAt: { $gte: oneMonthAgo },
  });

  // --------------------------
  // 5) Search Terms
  // --------------------------
  const topSearches = await SearchQuery.aggregate([
    {
      $group: {
        _id: { $ifNull: ["$normalizedQuery", "$query"] },
        total: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
    { $limit: 8 },
  ]);

  // --------------------------
  // 6) Events
  // --------------------------
  const eventStats = await InteractionLog.aggregate([
    {
      $group: {
        _id: "$event",
        total: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);

  // --------------------------
  // 7) Overview
  // --------------------------
  const totalViews = await PageView.countDocuments();
  const totalProductViews = await ProductView.countDocuments();
  const totalSearches = await SearchQuery.countDocuments();
  const totalInteractions = await InteractionLog.countDocuments();

  const overview = {
    totalViews,
    totalProductViews,
    totalSearches,
    totalInteractions,
    activeUsersDaily,
    activeUsersMonthly,
  };

  // --------------------------
  // 8) Trend Stats
  // --------------------------
  // Extract current and previous month values
  const thisMonthViews =
    pageViewsMonthly.find((x) => x._id.month - 1 === currentMonthIndex)
      ?.total || 0;

  const prevMonthViews =
    pageViewsMonthly.find((x) => x._id.month - 1 === currentMonthIndex - 1)
      ?.total || 0;

  const trendViews =
    prevMonthViews > 0
      ? (((thisMonthViews - prevMonthViews) / prevMonthViews) * 100).toFixed(1)
      : "0";

  const trendStats = {
    viewsGrowth: trendViews,
    activeUsersGrowth:
      activeUsersMonthly > 0
        ? (
            ((activeUsersDaily - activeUsersMonthly / 30) /
              (activeUsersMonthly / 30)) *
            100
          ).toFixed(1)
        : "0",
  };

  // --------------------------
  // Return Data
  // --------------------------
  return {
    monthlyViews,
    popularProducts,
    topSearches,
    eventStats,
    overview,
    trendStats,
    topPages,
  };
}

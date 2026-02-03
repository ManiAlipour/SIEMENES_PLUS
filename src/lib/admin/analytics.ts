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

// نگاشت تقریبی ماه میلادی (۱–۱۲) به ایندکس ماه شمسی در MONTH_NAMES (۰–۱۱)
// این نگاشت بر اساس شروع سال شمسی در حوالی ۱ فروردین (۲۱/۲۲ مارس) تنظیم شده است
// 1 → دی، 2 → بهمن، 3 → اسفند، 4 → فروردین، ... ، 12 → آذر
const GREGORIAN_TO_JALALI_MONTH_INDEX: number[] = [
  9, // Jan  -> دی
  10, // Feb -> بهمن
  11, // Mar -> اسفند
  0, // Apr -> فروردین
  1, // May -> اردیبهشت
  2, // Jun -> خرداد
  3, // Jul -> تیر
  4, // Aug -> مرداد
  5, // Sep -> شهریور
  6, // Oct -> مهر
  7, // Nov -> آبان
  8, // Dec -> آذر
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
  // استخراج مقدار ماه فعلی و ماه قبلی
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
    monthlyViews, // نمودار ماهانه
    popularProducts, // محصولات محبوب
    topSearches, // جستجوهای برتر
    eventStats, // تعاملات
    overview, // آمار کلی
    trendStats, // روند
    topPages, // صفحات پربازدید
  };
}

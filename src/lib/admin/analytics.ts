import type { Model, PipelineStage } from "mongoose";

import PageView from "@/models/PageView";
import ProductView from "@/models/ProductView";
import UserSession from "@/models/UserSession";
import SearchQuery from "@/models/SearchQuery";
import InteractionLog from "@/models/InteractionLog";
import User from "@/models/User";
import Product from "@/models/Product";
import Post from "@/models/Post";
import BlogPost from "@/models/BlogPost";
import Category from "@/models/Category";
import Comment from "@/models/Comment";
import Contact from "@/models/Contact";
import { connectDB } from "@/lib/db";

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

const GREGORIAN_TO_JALALI_MONTH_INDEX: number[] = [
  9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8,
];

const DAY_NAMES = [
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
  "شنبه",
];

const currentMonthIndex = new Date().getMonth();

function startOfMonth(date = new Date()) {
  const d = new Date(date);

  d.setDate(1);
  d.setHours(0, 0, 0, 0);

  return d;
}

function daysAgo(n: number) {
  const d = new Date();

  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);

  return d;
}

type MonthAgg = {
  _id: {
    month: number;
  };
  total: number;
};

type DailyAgg = {
  _id: string;
  total: number;
};

type AggregatableModel = Pick<Model<any>, "aggregate">;

function buildMonthlySeries(
  items: MonthAgg[],
): { month: string; views: number }[] {
  const map = new Map(items.map((i) => [i._id.month, i.total]));

  return Array.from({ length: 12 }, (_, i) => {
    const gregMonth = i + 1;
    const jalaliIndex = GREGORIAN_TO_JALALI_MONTH_INDEX[i] ?? i;

    return {
      month: MONTH_NAMES[jalaliIndex],
      views: map.get(gregMonth) ?? 0,
    };
  });
}

async function aggregateDailyCounts(
  model: AggregatableModel,
  dateField: string,
  since: Date,
): Promise<DailyAgg[]> {
  const pipeline: PipelineStage[] = [
    {
      $match: {
        [dateField]: {
          $gte: since,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: `$${dateField}`,
          },
        },
        total: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ];

  return model.aggregate<DailyAgg>(pipeline);
}

function buildDailySeries(
  days: number,
  series: Record<string, Map<string, number>>,
) {
  return Array.from({ length: days }, (_, i) => {
    const date = daysAgo(days - 1 - i);
    const key = date.toISOString().slice(0, 10);
    const label = DAY_NAMES[date.getDay()];
    const row: Record<string, string | number> = {
      day: label,
      date: key,
    };

    for (const [metric, map] of Object.entries(series)) {
      row[metric] = map.get(key) ?? 0;
    }

    return row;
  });
}

export async function getAdminAnalytics() {
  await connectDB();

  const now = new Date();
  const oneDayAgo = daysAgo(1);
  const sevenDaysAgo = daysAgo(6);
  const monthStart = startOfMonth();

  const prevMonthStart = startOfMonth(
    new Date(now.getFullYear(), now.getMonth() - 1, 1),
  );

  const prevMonthEnd = new Date(monthStart.getTime() - 1);

  const [
    pageViewsMonthly,
    popularProductsRaw,
    topPages,
    topSearches,
    eventStats,
    totalViews,
    totalProductViews,
    totalSearches,
    totalInteractions,
    activeUsersDaily,
    activeUsersMonthly,
    contentCounts,
    periodCounts,
    commentsByType,
    contactsByStatus,
    dailyViewsRaw,
    productViewsMonthly,
    commentsMonthly,
    usersMonthly,
    searchesMonthly,
    interactionsMonthly,
    contactsMonthly,
    dailyCommentsRaw,
    dailySearchesRaw,
    dailyProductViewsRaw,
  ] = await Promise.all([
    PageView.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$timestamp",
            },
          },
          total: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]),

    ProductView.aggregate([
      {
        $group: {
          _id: "$productId",
          views: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          views: -1,
        },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: {
          path: "$product",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          views: 1,
          name: {
            $ifNull: ["$product.name", "محصول حذف‌شده"],
          },
          slug: "$product.slug",
        },
      },
    ]),

    PageView.aggregate([
      {
        $group: {
          _id: "$url",
          total: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          total: -1,
        },
      },
      {
        $limit: 8,
      },
    ]),

    SearchQuery.aggregate([
      {
        $group: {
          _id: {
            $ifNull: ["$normalizedQuery", "$query"],
          },
          total: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          total: -1,
        },
      },
      {
        $limit: 8,
      },
    ]),

    InteractionLog.aggregate([
      {
        $group: {
          _id: "$event",
          total: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          total: -1,
        },
      },
      {
        $limit: 10,
      },
    ]),

    PageView.countDocuments(),
    ProductView.countDocuments(),
    SearchQuery.countDocuments(),
    InteractionLog.countDocuments(),

    UserSession.countDocuments({
      loginAt: {
        $gte: oneDayAgo,
      },
    }),

    UserSession.countDocuments({
      loginAt: {
        $gte: daysAgo(30),
      },
    }),

    Promise.all([
      User.countDocuments(),
      User.countDocuments({
        verified: true,
      }),
      Product.countDocuments(),
      BlogPost.countDocuments(),
      Post.countDocuments(),
      Category.countDocuments(),
      Comment.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({
        status: "pending",
      }),
      Contact.countDocuments({
        status: "answered",
      }),
    ]).then(
      ([
        totalUsers,
        verifiedUsers,
        totalProducts,
        totalBlogPosts,
        totalPosts,
        totalCategories,
        totalComments,
        totalContacts,
        pendingContacts,
        answeredContacts,
      ]) => ({
        totalUsers,
        verifiedUsers,
        totalProducts,
        totalBlogPosts,
        totalPosts,
        totalCategories,
        totalComments,
        totalContacts,
        pendingContacts,
        answeredContacts,
      }),
    ),

    Promise.all([
      User.countDocuments({
        createdAt: {
          $gte: monthStart,
        },
      }),
      Comment.countDocuments({
        createdAt: {
          $gte: monthStart,
        },
      }),
      Comment.countDocuments({
        createdAt: {
          $gte: oneDayAgo,
        },
      }),
      PageView.countDocuments({
        timestamp: {
          $gte: oneDayAgo,
        },
      }),
      PageView.countDocuments({
        timestamp: {
          $gte: sevenDaysAgo,
        },
      }),
      PageView.countDocuments({
        timestamp: {
          $gte: monthStart,
        },
      }),
      PageView.countDocuments({
        timestamp: {
          $gte: prevMonthStart,
          $lte: prevMonthEnd,
        },
      }),
      ProductView.countDocuments({
        timestamp: {
          $gte: monthStart,
        },
      }),
      BlogPost.countDocuments({
        createdAt: {
          $gte: monthStart,
        },
      }),
    ]).then(
      ([
        newUsersThisMonth,
        newCommentsThisMonth,
        commentsToday,
        pageViewsToday,
        pageViewsLast7Days,
        pageViewsThisMonth,
        pageViewsPrevMonth,
        productViewsThisMonth,
        newBlogPostsThisMonth,
      ]) => ({
        newUsersThisMonth,
        newCommentsThisMonth,
        commentsToday,
        pageViewsToday,
        pageViewsLast7Days,
        pageViewsThisMonth,
        pageViewsPrevMonth,
        productViewsThisMonth,
        newBlogPostsThisMonth,
      }),
    ),

    Comment.aggregate([
      {
        $group: {
          _id: "$targetType",
          total: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          total: -1,
        },
      },
    ]),

    Contact.aggregate([
      {
        $group: {
          _id: "$status",
          total: {
            $sum: 1,
          },
        },
      },
    ]),

    PageView.aggregate([
      {
        $match: {
          timestamp: {
            $gte: sevenDaysAgo,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$timestamp",
            },
          },
          total: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]),

    ProductView.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$timestamp",
            },
          },
          total: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]),

    Comment.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },
          total: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]),

    User.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },
          total: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]),

    SearchQuery.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$timestamp",
            },
          },
          total: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]),

    InteractionLog.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$timestamp",
            },
          },
          total: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]),

    Contact.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },
          total: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]),

    aggregateDailyCounts(Comment, "createdAt", sevenDaysAgo),
    aggregateDailyCounts(SearchQuery, "timestamp", sevenDaysAgo),
    aggregateDailyCounts(ProductView, "timestamp", sevenDaysAgo),
  ]);

  const monthlyViews = buildMonthlySeries(pageViewsMonthly);

  const dailyViewsMap = new Map(
    dailyViewsRaw.map((d) => [d._id, d.total as number]),
  );

  const dailyViews = Array.from({ length: 7 }, (_, i) => {
    const date = daysAgo(6 - i);
    const key = date.toISOString().slice(0, 10);
    const label = DAY_NAMES[date.getDay()];

    return {
      day: label,
      date: key,
      views: dailyViewsMap.get(key) ?? 0,
    };
  });

  const dailyEngagement = buildDailySeries(7, {
    pageViews: dailyViewsMap,
    productViews: new Map(dailyProductViewsRaw.map((d) => [d._id, d.total])),
    comments: new Map(dailyCommentsRaw.map((d) => [d._id, d.total])),
    searches: new Map(dailySearchesRaw.map((d) => [d._id, d.total])),
  }) as {
    day: string;
    date: string;
    pageViews: number;
    productViews: number;
    comments: number;
    searches: number;
  }[];

  const contentMix = [
    {
      label: "محصولات",
      value: contentCounts.totalProducts,
    },
    {
      label: "مطالب وبلاگ",
      value: contentCounts.totalBlogPosts,
    },
    {
      label: "ویدیو / پست",
      value: contentCounts.totalPosts,
    },
    {
      label: "دسته‌بندی",
      value: contentCounts.totalCategories,
    },
    {
      label: "نظرات",
      value: contentCounts.totalComments,
    },
  ].filter((i) => i.value > 0);

  const engagementMix = [
    {
      label: "بازدید صفحات",
      value: totalViews,
    },
    {
      label: "بازدید محصول",
      value: totalProductViews,
    },
    {
      label: "جستجو",
      value: totalSearches,
    },
    {
      label: "تعامل",
      value: totalInteractions,
    },
    {
      label: "پیام تماس",
      value: contentCounts.totalContacts,
    },
  ].filter((i) => i.value > 0);

  const overview = {
    totalViews,
    totalProductViews,
    totalSearches,
    totalInteractions,
    activeUsersDaily,
    activeUsersMonthly,
    ...contentCounts,
    ...periodCounts,
  };

  const thisMonthViews =
    pageViewsMonthly.find((x) => x._id.month - 1 === currentMonthIndex)
      ?.total || 0;

  const prevMonthViews =
    pageViewsMonthly.find((x) => x._id.month - 1 === currentMonthIndex - 1)
      ?.total || 0;

  const viewsGrowth =
    periodCounts.pageViewsPrevMonth > 0
      ? (
          ((periodCounts.pageViewsThisMonth - periodCounts.pageViewsPrevMonth) /
            periodCounts.pageViewsPrevMonth) *
          100
        ).toFixed(1)
      : "0";

  const trendStats = {
    viewsGrowth,
    monthlyViewsChange:
      prevMonthViews > 0
        ? (((thisMonthViews - prevMonthViews) / prevMonthViews) * 100).toFixed(
            1,
          )
        : "0",

    activeUsersGrowth:
      activeUsersMonthly > 0
        ? (
            ((activeUsersDaily - activeUsersMonthly / 30) /
              (activeUsersMonthly / 30)) *
            100
          ).toFixed(1)
        : "0",
  };

  const productViewsMonthlyMapped = buildMonthlySeries(productViewsMonthly);

  return {
    monthlyViews,
    dailyViews,
    dailyEngagement,
    productViewsMonthly: productViewsMonthlyMapped,
    monthlyComments: buildMonthlySeries(commentsMonthly),
    monthlyUsers: buildMonthlySeries(usersMonthly),
    monthlySearches: buildMonthlySeries(searchesMonthly),
    monthlyInteractions: buildMonthlySeries(interactionsMonthly),
    monthlyContacts: buildMonthlySeries(contactsMonthly),
    contentMix,
    engagementMix,
    popularProducts: popularProductsRaw,
    topSearches,
    eventStats,
    overview,
    trendStats,
    topPages,
    commentsByType: commentsByType.map((c) => ({
      _id: c._id as string,
      total: c.total as number,
    })),
    contactsByStatus: contactsByStatus.map((c) => ({
      _id: c._id as string,
      total: c.total as number,
    })),
  };
}

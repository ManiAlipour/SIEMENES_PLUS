import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Post from "@/models/Post";
import BlogPost from "@/models/BlogPost";
import Contact from "@/models/Contact";
import Product from "@/models/Product";
import Comment from "@/models/Comment";
import Category from "@/models/Category";
import { adminOnly } from "@/lib/middlewares/adminOnly";

export const runtime = "nodejs";

function startOfMonth() {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET(request: Request) {
  try {
    await adminOnly(request);
    await connectDB();

    const monthStart = startOfMonth();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeUsers,
      totalPosts,
      totalBlogPosts,
      totalTickets,
      totalProducts,
      totalComments,
      totalCategories,
      pendingTickets,
      answeredTickets,
      newUsersThisMonth,
      newCommentsThisMonth,
      commentsToday,
      commentsByType,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ verified: true }),
      Post.countDocuments(),
      BlogPost.countDocuments(),
      Contact.countDocuments(),
      Product.countDocuments(),
      Comment.countDocuments(),
      Category.countDocuments(),
      Contact.countDocuments({ status: "pending" }),
      Contact.countDocuments({ status: "answered" }),
      User.countDocuments({ createdAt: { $gte: monthStart } }),
      Comment.countDocuments({ createdAt: { $gte: monthStart } }),
      Comment.countDocuments({ createdAt: { $gte: oneDayAgo } }),
      Comment.aggregate([
        { $group: { _id: "$targetType", total: { $sum: 1 } } },
      ]),
    ]);

    return NextResponse.json({
      totalUsers,
      activeUsers,
      totalPosts,
      totalBlogPosts,
      totalProducts,
      totalComments,
      totalCategories,
      totalTickets,
      pendingTickets,
      answeredTickets,
      newUsersThisMonth,
      newCommentsThisMonth,
      commentsToday,
      commentsByType: Object.fromEntries(
        commentsByType.map((c) => [c._id, c.total]),
      ),
    });
  } catch (err: unknown) {
    console.error("Admin /stats error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Post from "@/models/Post";
import Ticket from "@/models/Contact";
import Product from "@/models/Product";
import Comment from "@/models/Comment";
import { adminOnly } from "@/lib/middlewares/adminOnly";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await adminOnly(request);
    await connectDB();

    const [totalUsers, totalPosts, totalTickets, totalProducts, totalComments] =
      await Promise.all([
        User.countDocuments(),
        Post.countDocuments(),
        Ticket.countDocuments(),
        Product.countDocuments(),
        Comment.countDocuments(),
      ]);

    const activeUsers = await User.countDocuments({ isVerified: true });
    const pendingTickets = await Ticket.countDocuments({ status: "pending" });

    return NextResponse.json({
      totalUsers,
      activeUsers,
      totalPosts,
      totalProducts,
      totalComments,
      totalTickets,
      pendingTickets,
    });
  } catch (err: any) {
    console.error("Admin /stats error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

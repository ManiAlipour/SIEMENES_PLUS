import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Post from "@/models/Post";
import Ticket from "@/models/Ticket";
import Product from "@/models/Product";
import Comment from "@/models/Comment";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await connectDB();

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    const decoded: any = verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

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

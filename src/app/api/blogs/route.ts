import { connectDB } from "@/lib/db";
import Post, { sanitizePost } from "@/models/Post";
import { NextResponse } from "next/server";

// دریافت همه پست‌ها با امکان فیلتر و جستجو
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);

    let query: any = {};
    if (status) query.status = status;
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const postsPromise = Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const countPromise = Post.countDocuments(query);

    const [posts, total] = await Promise.all([postsPromise, countPromise]);

    return NextResponse.json({
      data: posts.map(sanitizePost),
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

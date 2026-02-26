import { connectDB } from "@/lib/db";
import BlogPost, { sanitizeBlogPost } from "@/models/BlogPost";
import { NextResponse } from "next/server";
import { escapeRegex } from "@/lib/analytics/search";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const tag = (searchParams.get("tag") || "").trim();
    const search = (searchParams.get("search") || "").trim();
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);

    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: new RegExp(escapeRegex(search), "i") } },
        { excerpt: { $regex: new RegExp(escapeRegex(search), "i") } },
      ];
    }

    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      BlogPost.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      BlogPost.countDocuments(query),
    ]);

    return NextResponse.json({
      data: posts.map(sanitizeBlogPost),
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

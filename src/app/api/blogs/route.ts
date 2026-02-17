import { connectDB } from "@/lib/db";
import Post, { sanitizePost } from "@/models/Post";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { escapeRegex, logSearchQuery, normalizeSearchQuery } from "@/lib/analytics/search";

// GET: Fetch all blog posts with optional filter and search
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = (searchParams.get("search") || "").trim();
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);

    let query: any = {};
    if (status) query.status = status;
    if (search) {
      // Sanitize to prevent regex injection
      query.title = { $regex: new RegExp(escapeRegex(search), "i") };
    }

    const skip = (page - 1) * limit;

    const postsPromise = Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const countPromise = Post.countDocuments(query);

    const [posts, total] = await Promise.all([postsPromise, countPromise]);

    // Log search only on first page (avoid duplicate counts on pagination)
    if (search && page === 1) {
      try {
        const cookie =await cookies()
        const tokenValue = cookie.get("token")?.value;
        let userId: string | null = null;
        if (tokenValue) {
          try {
            userId = verifyToken(tokenValue).id;
          } catch {
            userId = null;
          }
        }

        await logSearchQuery({
          query: search,
          normalizedQuery: normalizeSearchQuery(search),
          totalResults: total,
          source: "blogs",
          userId,
          meta: {
            status,
          },
        });
      } catch (err) {
        console.error("SearchQuery log failed (blogs):", err);
      }
    }

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

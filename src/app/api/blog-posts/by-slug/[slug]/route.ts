import { connectDB } from "@/lib/db";
import BlogPost, { sanitizeBlogPost } from "@/models/BlogPost";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    await connectDB();
    const { slug } = await context.params;
    const { searchParams } = new URL(req.url);
    const preview = searchParams.get("preview") === "1";

    if (!slug) {
      return NextResponse.json({ error: "اسلاگ مشخص نیست" }, { status: 400 });
    }

    const post = (await BlogPost.findOne({
      slug: slug.trim().toLowerCase(),
    }).lean()) as any;
    if (!post) {
      return NextResponse.json({ error: "مطلب یافت نشد" }, { status: 404 });
    }

    if (post.status !== "published" && !preview) {
      return NextResponse.json({ error: "مطلب یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({ data: sanitizeBlogPost(post) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

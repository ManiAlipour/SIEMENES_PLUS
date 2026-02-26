import { NextRequest, NextResponse } from "next/server";
import BlogPost, { sanitizeBlogPost } from "@/models/BlogPost";
import { connectDB } from "@/lib/db";
import { adminOnly } from "@/lib/middlewares/adminOnly";
import slugify from "slugify";

async function ensureUniqueSlug(slug: string, excludeId?: string): Promise<string> {
  const filter: Record<string, unknown> = { slug };
  if (excludeId) filter._id = { $ne: excludeId };
  const existing = await BlogPost.findOne(filter);
  if (!existing) return slug;
  const base = slug.replace(/-[0-9]+$/, "");
  let n = 1;
  for (;;) {
    const candidate = `${base}-${n}`;
    const f: Record<string, unknown> = { slug: candidate };
    if (excludeId) f._id = { $ne: excludeId };
    const taken = await BlogPost.findOne(f);
    if (!taken) return candidate;
    n++;
  }
}

export async function GET(req: NextRequest) {
  try {
    const authResult = await adminOnly(req);
    if (authResult) return authResult;
    await connectDB();
    const posts = await BlogPost.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data: posts.map(sanitizeBlogPost) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await adminOnly(req);
    if (authResult) return authResult;
    await connectDB();
    const body = await req.json();
    const {
      title,
      slug: rawSlug,
      excerpt = "",
      content = "",
      coverImage = "",
      images = [],
      video = "",
      status = "draft",
      embeddedProducts = [],
      tags = [],
    } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "عنوان الزامی است" }, { status: 400 });
    }

    if (video && typeof video === "string") {
      const aparatRegex = /^https?:\/\/(www\.)?aparat\.com\/.+/;
      if (!aparatRegex.test(video)) {
        return NextResponse.json(
          { error: "لینک ویدیو باید آدرس صحیح از Aparat باشد" },
          { status: 400 },
        );
      }
    }

    const slugBase = rawSlug?.trim()
      ? slugify(rawSlug, { lower: true, strict: true })
      : slugify(title, { lower: true, strict: true });
    const slug = await ensureUniqueSlug(slugBase);

    const validEmbedded = Array.isArray(embeddedProducts)
      ? embeddedProducts.filter((p: any) => p && p.productId && p.slug && p.blockId)
      : [];
    const validImages = Array.isArray(images)
      ? images.filter((u: any) => typeof u === "string")
      : [];
    const validTags = Array.isArray(tags)
      ? tags.map((t: any) => String(t).trim()).filter(Boolean)
      : [];

    const doc = await BlogPost.create({
      title: title.trim(),
      slug,
      excerpt: typeof excerpt === "string" ? excerpt.trim().slice(0, 400) : "",
      content: typeof content === "string" ? content : "",
      coverImage: typeof coverImage === "string" ? coverImage : "",
      images: validImages,
      video: typeof video === "string" ? video : "",
      status: status === "published" ? "published" : "draft",
      embeddedProducts: validEmbedded,
      tags: validTags,
    });

    return NextResponse.json({ data: sanitizeBlogPost(doc) }, { status: 201 });
  } catch (err: any) {
    console.error("Admin blog-post POST:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

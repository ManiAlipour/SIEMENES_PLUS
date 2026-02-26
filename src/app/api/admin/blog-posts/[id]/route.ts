import { NextResponse, NextRequest } from "next/server";
import BlogPost, { sanitizeBlogPost } from "@/models/BlogPost";
import { connectDB } from "@/lib/db";
import { adminOnly } from "@/lib/middlewares/adminOnly";
import slugify from "slugify";

async function ensureUniqueSlug(slug: string, excludeId: string): Promise<string> {
  const existing = await BlogPost.findOne({ slug, _id: { $ne: excludeId } });
  if (!existing) return slug;
  const base = slug.replace(/-[0-9]+$/, "");
  let n = 1;
  for (;;) {
    const candidate = `${base}-${n}`;
    const taken = await BlogPost.findOne({ slug: candidate, _id: { $ne: excludeId } });
    if (!taken) return candidate;
    n++;
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const authResult = await adminOnly(request);
    if (authResult) return authResult;
    await connectDB();
    const deleted = await BlogPost.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "مطلب پیدا نشد" }, { status: 404 });
    }
    return NextResponse.json({ message: "مطلب با موفقیت حذف شد" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const authResult = await adminOnly(request);
    if (authResult) return authResult;
    await connectDB();
    const body = await request.json();
    const {
      title,
      slug: rawSlug,
      excerpt,
      content,
      coverImage,
      images,
      video,
      status,
      embeddedProducts,
      tags,
    } = body;

    const update: Record<string, unknown> = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return NextResponse.json({ error: "عنوان الزامی است" }, { status: 400 });
      }
      update.title = title.trim();
    }

    if (rawSlug !== undefined) {
      const slugBase =
        typeof rawSlug === "string" && rawSlug.trim()
          ? slugify(rawSlug.trim(), { lower: true, strict: true })
          : title !== undefined
            ? slugify((body.title || "").trim(), { lower: true, strict: true })
            : null;
      if (slugBase) {
        update.slug = await ensureUniqueSlug(slugBase, id);
      }
    }

    if (excerpt !== undefined)
      update.excerpt =
        typeof excerpt === "string" ? excerpt.trim().slice(0, 400) : "";
    if (content !== undefined)
      update.content = typeof content === "string" ? content : "";
    if (coverImage !== undefined)
      update.coverImage = typeof coverImage === "string" ? coverImage : "";
    if (images !== undefined)
      update.images = Array.isArray(images)
        ? images.filter((u: any) => typeof u === "string")
        : [];
    if (video !== undefined) {
      const v = typeof video === "string" ? video : "";
      if (v) {
        const aparatRegex = /^https?:\/\/(www\.)?aparat\.com\/.+/;
        if (!aparatRegex.test(v)) {
          return NextResponse.json(
            { error: "لینک ویدیو باید آدرس صحیح از Aparat باشد" },
            { status: 400 },
          );
        }
      }
      update.video = v;
    }
    if (status === "published" || status === "draft") update.status = status;
    if (embeddedProducts !== undefined) {
      update.embeddedProducts = Array.isArray(embeddedProducts)
        ? embeddedProducts.filter(
            (p: any) => p && p.productId && p.slug && p.blockId,
          )
        : [];
    }
    if (tags !== undefined) {
      update.tags = Array.isArray(tags)
        ? tags.map((t: any) => String(t).trim()).filter(Boolean)
        : [];
    }

    const updated = await BlogPost.findByIdAndUpdate(id, update, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "مطلب پیدا نشد" }, { status: 404 });
    }
    return NextResponse.json({ data: sanitizeBlogPost(updated) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse, NextRequest } from "next/server";
import Post, { sanitizePost } from "@/models/Post";
import { connectDB } from "@/lib/db";
import { adminOnly } from "@/lib/middlewares/adminOnly";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const authResult = await adminOnly(request);
    if (authResult) return authResult;
    await connectDB();
    const deleted = await Post.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "ویدیو پیدا نشد" }, { status: 404 });
    }
    return NextResponse.json({ message: "ویدیو با موفقیت حذف شد" });
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
    const { title, video, status } = body;

    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "عنوان الزامی است" }, { status: 400 });
    }
    if (typeof video !== "string" || !video.trim()) {
      return NextResponse.json({ error: "لینک ویدیو الزامی است" }, { status: 400 });
    }
    if (status && status !== "draft" && status !== "published") {
      return NextResponse.json(
        { error: "مقدار وضعیت نامعتبر است" },
        { status: 400 },
      );
    }

    const aparatRegex = /^https?:\/\/(www\.)?aparat\.com\/.+/;
    if (!aparatRegex.test(video)) {
      return NextResponse.json(
        { error: "لینک ویدیو باید آدرس صحیح از Aparat باشد" },
        { status: 400 },
      );
    }

    const updated = await Post.findByIdAndUpdate(
      id,
      { title: title.trim(), video: video.trim(), ...(status ? { status } : {}) },
      { new: true },
    );
    if (!updated) {
      return NextResponse.json({ error: "ویدیو پیدا نشد" }, { status: 404 });
    }
    return NextResponse.json({ data: sanitizePost(updated) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

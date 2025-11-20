import { NextResponse } from "next/server";
import Post, { sanitizePost } from "@/models/Post";
import { connectDB } from "@/lib/db";

interface Params {
  params: Promise<{ id: string }>;
}

// DELETE blog
export async function DELETE(req: Request, { params }: Params) {
  const { id } = await params;
  try {
    await connectDB();
    const deleted = await Post.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Post deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH blog (edit)
export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  try {
    await connectDB();
    const body = await req.json();

    // Optional validation for mediaType
    if (body.mediaType === "video") {
      const aparatRegex = /^https?:\/\/(www\.)?aparat\.com\/.+/;
      if (!aparatRegex.test(body.coverImage)) {
        return NextResponse.json(
          { error: "Video link must be an Aparat URL" },
          { status: 400 }
        );
      }
    }

    if (body.mediaType === "image" && !body.coverImage) {
      return NextResponse.json(
        { error: "Image is required for mediaType=image" },
        { status: 400 }
      );
    }

    const updated = await Post.findByIdAndUpdate(id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ data: sanitizePost(updated) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

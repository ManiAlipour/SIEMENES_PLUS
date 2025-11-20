import { NextRequest, NextResponse } from "next/server";
import Post, { sanitizePost } from "@/models/Post";
import { connectDB } from "@/lib/db"; // اتصال به MongoDB
import { adminOnly } from "@/lib/middlewares/adminOnly";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find()
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ data: posts.map(sanitizePost) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    await adminOnly(req);

    const token = req.cookies.get("token")?.value;

    const decoded = verifyToken(token as string);

    const body = await req.json();
    const {
      title,
      content,
      tags,
      coverImage,
      mediaType,
      status = "draft",
    } = body;

    // Validation
    if (!title || !content || !mediaType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (mediaType === "video") {
      const aparatRegex = /^https?:\/\/(www\.)?aparat\.com\/.+/;
      if (!aparatRegex.test(coverImage)) {
        return NextResponse.json(
          { error: "Video link must be an Aparat URL" },
          { status: 400 }
        );
      }
    }
    if (mediaType === "image" && !coverImage) {
      return NextResponse.json(
        { error: "Image is required for mediaType=image" },
        { status: 400 }
      );
    }

    const postDoc = await Post.create({
      title,
      content,
      tags,
      coverImage,
      mediaType,
      status,
      author: decoded.id,
    });

    return NextResponse.json({ data: sanitizePost(postDoc) }, { status: 201 });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

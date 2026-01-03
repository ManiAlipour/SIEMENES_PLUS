import { NextRequest, NextResponse } from "next/server";
import Post, { sanitizePost } from "@/models/Post";
import { connectDB } from "@/lib/db"; // اتصال به MongoDB
import { adminOnly } from "@/lib/middlewares/adminOnly";

export async function GET() {
  try {
    await connectDB();

    const posts = await Post.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ data: posts.map(sanitizePost) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    await adminOnly(req);

    const body = await req.json();
    const {
      title,
      video,
      status = "draft"
    } = body;

    if (!title || !video) {
      return NextResponse.json(
        { error: "عنوان و ویدیو الزامی هستند" },
        { status: 400 }
      );
    }

    const aparatRegex = /^https?:\/\/(www\.)?aparat\.com\/.+/;
    if (!aparatRegex.test(video)) {
      return NextResponse.json(
        { error: "لینک ویدیو باید آدرس صحیح از Aparat باشد" },
        { status: 400 }
      );
    }

    const postDoc = await Post.create({
      title,
      video,
      status
    });

    return NextResponse.json({ data: sanitizePost(postDoc) }, { status: 201 });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

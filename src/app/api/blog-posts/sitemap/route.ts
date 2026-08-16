import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const posts = await BlogPost.find({}).select("slug").lean();

    return NextResponse.json({ data: posts });
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در ارتباط با سرور" },
      { status: 500 },
    );
  }
}

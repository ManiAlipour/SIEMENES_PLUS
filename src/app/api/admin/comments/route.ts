import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Comment from "@/models/Comment";
import { verify } from "jsonwebtoken";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await connectDB();
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const decoded: any = verify(token!, process.env.JWT_SECRET!);
    if (decoded.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const comments = await Comment.find()
      .populate("user", "email")
      .sort({ createdAt: -1 });
    return NextResponse.json({ comments });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const decoded: any = verify(token!, process.env.JWT_SECRET!);
    if (decoded.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { commentId, approved } = await request.json();
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { approved },
      { new: true }
    );
    return NextResponse.json({ comment: updatedComment });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verify } from "jsonwebtoken";
import { adminOnly } from "@/lib/middlewares/adminOnly";

export const runtime = "nodejs";

// GET: List users
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    await adminOnly(request);

    const users = await User.find({}, "-password -verificationCode").sort({
      createdAt: -1,
    });
    return NextResponse.json({
      success: true,
      message: "لیست کاربران با موفقیت دریافت شد",
      data: users,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Remove user by ID
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    const decoded: any = verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { userId } = await request.json();
    await User.findByIdAndDelete(userId);
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

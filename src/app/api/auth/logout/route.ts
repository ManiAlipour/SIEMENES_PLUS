import { sanitizeUser, verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { adminOnly } from "@/lib/middlewares/adminOnly";
import { authOnly } from "@/lib/middlewares/auth";
import User from "@/models/User";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    await authOnly(req);
    await connectDB();

    const body = await req.json().catch(() => null);
    const userId = body?.userId;

    if (userId) {
      await adminOnly(req);

      if (!mongoose.Types.ObjectId.isValid(userId))
        return NextResponse.json(
          { message: "شناسه نامعتبر", success: false, data: null },
          { status: 400 },
        );

      const user = await User.findByIdAndDelete(userId);
      if (!user)
        return NextResponse.json(
          { message: "کاربر یافت نشد", success: false, data: null },
          { status: 404 },
        );

      return NextResponse.json({
        message: "کاربر حذف شد",
        success: true,
        data: sanitizeUser(user),
      });
    }

    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json(
        { message: "توکن نامعتبر", success: false, data: null },
        { status: 401 },
      );

    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      return NextResponse.json(
        { message: "توکن منقضی شده", success: false, data: null },
        { status: 401 },
      );
    }

    const user = await User.findByIdAndDelete(payload.id);
    if (!user)
      return NextResponse.json(
        { message: "کاربر یافت نشد", success: false, data: null },
        { status: 404 },
      );

    const res = NextResponse.json({
      message: "اکانت شما حذف شد",
      success: true,
      data: sanitizeUser(user),
    });

    res.cookies.set("token", "", {
      expires: new Date(0),
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    return NextResponse.json(
      { message: "خطای سرور", success: false, data: null },
      { status: 500 },
    );
  }
}

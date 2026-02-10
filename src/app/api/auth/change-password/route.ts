import {
  sanitizeUser,
  verifyToken,
  generateToken,
  mapUserToTokenData,
} from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { authOnly } from "@/lib/middlewares/auth";
import User from "@/models/User";
import { compare, hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    await authOnly(req);
    await connectDB();

    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        {
          message: "تمام فیلدها الزامی است.",
          data: null,
          success: false,
        },
        { status: 400 },
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        {
          message: "پسورد جدید نمی‌تواند با پسورد فعلی یکسان باشد.",
          data: null,
          success: false,
        },
        { status: 400 },
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          message: "پسورد جدید و تکرار آن یکسان نیست.",
          data: null,
          success: false,
        },
        { status: 400 },
      );
    }

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "احراز هویت نامعتبر است.", success: false },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return NextResponse.json(
        { message: "توکن نامعتبر یا منقضی شده است.", success: false },
        { status: 401 },
      );
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { message: "کاربر یافت نشد.", success: false },
        { status: 404 },
      );
    }

    const isPasswordValid = await compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          message: "پسورد فعلی اشتباه است.",
          success: false,
        },
        { status: 401 },
      );
    }

    user.password = await hash(newPassword, 10);
    const updatedUser = await user.save();

    const res = NextResponse.json({
      message: "رمز عبور با موفقیت تغییر کرد.",
      data: sanitizeUser(user),
      success: true,
    });

    res.cookies.delete("token");
    const newToken = generateToken(mapUserToTokenData(updatedUser));
    res.cookies.set("token", newToken);

    return res;
  } catch (error) {
    return NextResponse.json(
      {
        message: "خطای ارتباط با سرور",
        data: null,
        success: false,
      },
      { status: 500 },
    );
  }
}

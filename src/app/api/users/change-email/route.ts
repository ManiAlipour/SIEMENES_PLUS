import { sanitizeUser, sendVerificationCode, verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { authOnly } from "@/lib/middlewares/auth";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await authOnly(req);
    await connectDB();

    const token = req.cookies.get("token")?.value;

    if (!token)
      return NextResponse.json(
        {
          message: "توکن نامعتبر است.",
          data: null,
          success: false,
        },
        { status: 401 },
      );

    console.log("1");

    const { id, email } = verifyToken(token);
    const { email: newEmail } = await req.json();
    const currentUser = await User.findById(id);
    const existEmail = await User.findOne({ email: newEmail });
    // console.log("------------------------------------");
    // console.log("token", existEmail);
    // console.log("------------------------------------");

    if (!currentUser)
      return NextResponse.json({
        message: "کاربر یافت نشد.",
        data: null,
        success: false,
      });

    if (email === newEmail)
      return NextResponse.json(
        {
          message: "ایمیل جدید و ایمیل شما نمیتواند یکسان باشد.",
          data: null,
          success: false,
        },
        { status: 400 },
      );

    if (existEmail)
      return NextResponse.json(
        {
          message: "این کاربر قبلا وارد شده است.",
          data: null,
          success: false,
        },
        { status: 400 },
      );

    console.log("4");

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    currentUser.email = newEmail;
    currentUser.verificationCode = verificationCode;
    currentUser.verified = false;

    console.log("5");
    await sendVerificationCode(verificationCode, newEmail, currentUser.name);

    const savedUser = await currentUser.save();

    req.cookies.delete("token");

    return NextResponse.json({
      message: "ایمیل شما ثبت شد و کدتایید به ایمیل شما ارسال شد.",
      data: sanitizeUser(savedUser),
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "مشکل در برقراری ارتباط با سرور",
        success: false,
        data: null,
        error,
      },
      { status: 500 },
    );
  }
}

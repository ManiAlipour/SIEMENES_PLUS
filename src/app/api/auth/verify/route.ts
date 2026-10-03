import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/auth";
import { verifyOtpSchema } from "@/lib/validations/authValidator";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = verifyOtpSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        {
          message:
            validatedData.error.issues[0]?.message ||
            "اطلاعات وارد شده معتبر نیست.",
          errors: validatedData.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { phoneNumber, code } = validatedData.data;

    if (!phoneNumber || !code) {
      return NextResponse.json(
        { error: "شماره موبایل و کد تایید الزامی است" },
        { status: 400 },
      );
    }

    const { token, user, message } = await verifyOtp({ phoneNumber, code });

    const res = NextResponse.json({ user, message }, { status: 200 });
    res.cookies.set("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Verification failed" },
      { status: 400 },
    );
  }
}

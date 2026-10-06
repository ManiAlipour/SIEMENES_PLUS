import { NextResponse } from "next/server";
import { changePasswordSchema } from "@/lib/validations/authValidator";
import { changePassword, verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

    if (!token) {
      return NextResponse.json(
        { message: "لطفاً ابتدا وارد حساب کاربری خود شوید." },
        { status: 401 },
      );
    }

    const decoded = verifyToken(token);

    const body = await req.json();

    const validatedData = changePasswordSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        {
          message:
            validatedData.error.issues[0]?.message ||
            "اطلاعات ورودی نامعتبر است.",
          errors: validatedData.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const {
      user,
      token: newToken,
      message,
    } = await changePassword({
      userId: decoded.id,
      currentPassword: validatedData.data.currentPassword,
      newPassword: validatedData.data.newPassword,
    });

    const response = NextResponse.json({ user, message }, { status: 200 });

    response.cookies.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "خطایی در تغییر رمز عبور رخ داد." },
      { status: 400 },
    );
  }
}

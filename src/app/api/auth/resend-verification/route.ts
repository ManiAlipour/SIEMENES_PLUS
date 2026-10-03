import { NextResponse } from "next/server";
import { resendOtp } from "@/lib/auth";
import { resendOtpSchema } from "@/lib/validations/authValidator";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = resendOtpSchema.safeParse(body);
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

    const { phoneNumber } = validatedData.data;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "شماره موبایل الزامی است" },
        { status: 400 },
      );
    }

    const result = await resendOtp({ phoneNumber });

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "خطا در ارسال کد مجدد" },
      { status: 500 },
    );
  }
}

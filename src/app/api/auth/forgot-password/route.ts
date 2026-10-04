import { NextResponse } from "next/server";
import { forgotPassword } from "@/lib/auth";
import { forgotPasswordSchema } from "@/lib/validations/authValidator";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = forgotPasswordSchema.safeParse(body);
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

    const result = await forgotPassword({ phoneNumber });
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "عملیات فراموشی رمزعبور موفق نبود." },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { resetPassword } from "@/lib/auth";
import { resetPasswordSchema } from "@/lib/validations/authValidator";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = resetPasswordSchema.safeParse(body);
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

    const { phoneNumber, code, newPassword, confirmPassword } =
      validatedData.data;

    if (newPassword !== confirmPassword)
      return NextResponse.json(
        {
          message: "رمز عبور و تایید رمز عبور یکسان نیست",
        },
        { status: 400 },
      );

    const result = await resetPassword({
      phoneNumber,
      code,
      newPassword,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Reset password failed" },
      { status: 400 },
    );
  }
}

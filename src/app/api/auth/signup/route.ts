import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations/authValidator";
import { register } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = registerSchema.safeParse(body);
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

    const result = await register(validatedData.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "خطای سرور" },
      { status: 400 },
    );
  }
}

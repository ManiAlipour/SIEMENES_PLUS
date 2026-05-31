import { NextResponse } from "next/server";
import { z } from "zod";
import { resetPassword } from "@/lib/auth";

const ResetPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
  token: z.string().min(10, "Invalid token"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ResetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { email, token, password } = parsed.data;

    const result = await resetPassword({
      email,
      token,
      newPassword: password,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Reset password failed" },
      { status: 400 },
    );
  }
}

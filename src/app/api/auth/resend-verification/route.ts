import { NextResponse } from "next/server";
import { resendVerificationCode } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body as { email?: string };

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const result = await resendVerificationCode({ email });


    // { success: true, message: "Verification code sent" }
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to send verification code" },
      { status: 500 },
    );
  }
}

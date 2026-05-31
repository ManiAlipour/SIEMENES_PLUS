import { NextResponse } from "next/server";
import { forgotPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const result = await forgotPassword({ email });
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Forgot password failed" },
      { status: 500 },
    );
  }
}

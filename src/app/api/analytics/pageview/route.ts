import { NextRequest, NextResponse } from "next/server";
import PageView from "@/models/PageView";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  await connectDB();

  const tokenValue = req.cookies.get("token")?.value;

  let userId: string | null = null;

  if (tokenValue) {
    const decoded = verifyToken(tokenValue);

    userId = decoded.id;
  }

  const body = await req.json();

  await PageView.create({
    url: body.url,
    userAgent: body.userAgent,
    ip: req.headers.get("x-forwarded-for") || null,
    userId,
  });

  return NextResponse.json({ ok: true });
}

import { connectDB } from "@/lib/db";
import AdminAction from "@/models/AdminAction";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const actions = await AdminAction.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();
  return NextResponse.json(actions);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  await AdminAction.create(body);
  return NextResponse.json({ success: true });
}

import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { adminOnly } from "@/lib/middlewares/adminOnly";
import AdminAction from "@/models/AdminAction";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  await adminOnly(req);

  const actions = await AdminAction.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();
  return NextResponse.json(actions);
}

export async function POST(req: NextRequest) {
  await connectDB();

  await adminOnly(req);

  const token = req.cookies.get("token")?.value as string;

  const decoded = verifyToken(token);

  const user = await User.findById(decoded.id);

  const body = await req.json();
  await AdminAction.create({
    ...body,
    author: user?.name,
  });
  return NextResponse.json({ success: true });
}

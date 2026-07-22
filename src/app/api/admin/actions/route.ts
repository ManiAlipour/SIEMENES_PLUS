import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { adminOnly } from "@/lib/middlewares/adminOnly";
import AdminAction from "@/models/AdminAction";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const authResult = await adminOnly(req);
    if (authResult) return authResult;

    const actions = await AdminAction.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json(actions);
  } catch (error) {
    console.error("Error fetching admin actions:", error);
    return NextResponse.json(
      { error: "خطا در دریافت فعالیت‌ها." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const authResult = await adminOnly(req);
    if (authResult) return authResult;

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    const body = await req.json();

    await AdminAction.create({
      action: body.action,
      entity: body.entity,
      entityName: body.entityName,
      user: user?.name || user?.email || "admin",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating admin action:", error);
    return NextResponse.json(
      { error: "خطا در ثبت فعالیت." },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { adminOnly } from "@/lib/middlewares/adminOnly";
import RepairOrder, { REPAIR_STAGES } from "@/models/RepairOrder";
import { normalizeIranMobile, sendInitialAcceptanceSms } from "@/lib/sms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const titles = ["دریافت تجهیز", "بررسی اولیه", "عیب‌یابی و تعمیر", "تست و تأیید عملکرد", "آماده ارسال"];
function authError(request: Request) { return adminOnly(request); }

export async function GET(request: Request) {
  const denied = await authError(request); if (denied) return denied;
  await connectDB();
  const orders = await RepairOrder.find().sort({ createdAt: -1 }).limit(100).lean();
  return NextResponse.json({ success: true, data: orders });
}

export async function POST(request: Request) {
  const denied = await authError(request); if (denied) return denied;
  try {
    const body = await request.json();
    const acceptanceNumber = String(body.acceptanceNumber || "").trim();
    const deviceName = String(body.deviceName || "").trim();
    const deviceModel = String(body.deviceModel || "").trim();
    const customerPhone = normalizeIranMobile(String(body.customerPhone || ""));
    if (!acceptanceNumber || !deviceName || !deviceModel || !/^09\d{9}$/.test(customerPhone)) return NextResponse.json({ success: false, message: "شماره پذیرش، مشخصات تجهیز و موبایل معتبر را وارد کنید." }, { status: 400 });
    await connectDB();
    const initialNote = "تجهیز در کارگاه زیمنس پلاس دریافت شد.";
    const order = await RepairOrder.create({ acceptanceNumber, deviceName, deviceModel, customerPhone, currentStage: REPAIR_STAGES[0], receivedAt: body.receivedAt ? new Date(body.receivedAt) : new Date(), lastUpdateNote: initialNote, stageLogs: [{ stage: REPAIR_STAGES[0], title: titles[0], description: initialNote, updatedAt: new Date() }] });
    const sms = await sendInitialAcceptanceSms({ mobile: order.customerPhone, acceptanceNumber, deviceName, trackingToken: order.trackingToken });
    return NextResponse.json({ success: true, data: order, sms }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.code === 11000 ? "شماره پذیرش تکراری است." : error.message || "ثبت تعمیر انجام نشد." }, { status: 400 });
  }
}

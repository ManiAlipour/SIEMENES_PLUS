import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { adminOnly } from "@/lib/middlewares/adminOnly";
import RepairOrder, { REPAIR_STAGES, type RepairStageType } from "@/models/RepairOrder";
import { updateRepairStage } from "@/services/repairService";
import { uploadFileToStorage } from "@/lib/storage/storage.service";

export const runtime = "nodejs";
export async function PATCH(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const denied = await adminOnly(request); if (denied) return denied;
  try {
    const { token } = await params; const body = await request.json();
    if (!REPAIR_STAGES.includes(body.stage)) return NextResponse.json({ success: false, message: "مرحله نامعتبر است." }, { status: 400 });
    const result = await updateRepairStage(token, body.stage as RepairStageType, String(body.note || "").trim() || undefined);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) { return NextResponse.json({ success: false, message: error.message || "بروزرسانی انجام نشد." }, { status: 400 }); }
}

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const denied = await adminOnly(request); if (denied) return denied;
  try {
    const { token } = await params; const form = await request.formData(); const file = form.get("image"); const type = form.get("type");
    if (!(file instanceof File) || !["BEFORE", "AFTER"].includes(String(type)) || !file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) return NextResponse.json({ success: false, message: "تصویر معتبر تا حجم ۸ مگابایت انتخاب کنید." }, { status: 400 });
    await connectDB();
    const order = await RepairOrder.findOne({ trackingToken: token }); if (!order) return NextResponse.json({ success: false, message: "تعمیر پیدا نشد." }, { status: 404 });
    const uploaded = await uploadFileToStorage(file, { folder: `repairs/${token}` }); if (!uploaded.url) throw new Error("آدرس عمومی فضای ذخیره‌سازی تنظیم نشده است.");
    order.images.push({ type: type as "BEFORE" | "AFTER", url: uploaded.url, createdAt: new Date() }); await order.save();
    return NextResponse.json({ success: true, data: order });
  } catch (error: any) { return NextResponse.json({ success: false, message: error.message || "آپلود تصویر انجام نشد." }, { status: 500 }); }
}

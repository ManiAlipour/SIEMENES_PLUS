import { NextRequest, NextResponse } from "next/server";
import { adminOnly } from "@/lib/middlewares/adminOnly";
import { uploadValidator } from "@/lib/middlewares/uploadValidator";
import { uploadFileToStorage } from "@/lib/storage/storage.service";

export async function POST(req: NextRequest) {
  try {
    const authResult = await adminOnly(req);
    if (authResult) return authResult;

    const validation = await uploadValidator(req, {
      maxSizeMB: 50,
      allowedTypes: ["video/mp4", "video/webm"],
      maxFiles: 1,
    });

    if (!validation.valid || !validation.files?.length) {
      return NextResponse.json(
        { error: validation.error || "فایل معتبر نیست" },
        { status: 400 },
      );
    }

    const file = validation.files[0];
    const { url } = await uploadFileToStorage(file, { folder: "blog/videos" });

    if (!url) {
      return NextResponse.json(
        { error: "آدرس عمومی فایل پیکربندی نشده است" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url });
  } catch (err: any) {
    console.error("Blog video upload error:", err);
    return NextResponse.json(
      { error: err.message || "خطا در آپلود ویدیو" },
      { status: 500 },
    );
  }
}

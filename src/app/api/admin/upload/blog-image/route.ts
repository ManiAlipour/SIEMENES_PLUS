import { NextRequest, NextResponse } from "next/server";
import { adminOnly } from "@/lib/middlewares/adminOnly";
import { uploadValidator } from "@/lib/middlewares/uploadValidator";
import { uploadToLiara } from "@/lib/uploadToLiara";

export async function POST(req: NextRequest) {
  try {
    const authResult = await adminOnly(req);
    if (authResult) return authResult;

    const validation = await uploadValidator(req, {
      maxSizeMB: 5,
      allowedTypes: ["image/jpeg", "image/png", "image/webp"],
      maxFiles: 1,
    });

    if (!validation.valid || !validation.files?.length) {
      return NextResponse.json(
        { error: validation.error || "فایل معتبر نیست" },
        { status: 400 },
      );
    }

    const file = validation.files[0];
    const { url } = await uploadToLiara(file, "blog");

    return NextResponse.json({ url });
  } catch (err: any) {
    console.error("Blog image upload error:", err);
    return NextResponse.json(
      { error: err.message || "خطا در آپلود تصویر" },
      { status: 500 },
    );
  }
}

import { NextRequest } from "next/server";

export interface UploadOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
  maxFiles?: number;
}

/**
 * ✅ uploadValidator — Middleware برای اعتبارسنجی فایل‌ها قبل از آپلود
 * @param req - درخواست Next.js شامل FormData
 * @param options - تنظیمات مجاز برای حجم و نوع فایل
 * @returns {Promise<{ valid: boolean; error?: string; files?: File[] }>}
 */
export async function uploadValidator(
  req: NextRequest,
  options?: UploadOptions
): Promise<{ valid: boolean; error?: string; files?: File[] }> {
  try {
    // ۱. تنظیمات پیش‌فرض
    const maxSize = (options?.maxSizeMB ?? 10) * 1024 * 1024; // ۱۰ مگابایت پیش‌فرض
    const allowed = options?.allowedTypes ?? [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    const maxFiles = options?.maxFiles ?? 3;

    // ۲. چک کردن وجود FormData
    const formData = await req.formData();
    const files: File[] = [];

    // ۳. استخراج فایل‌ها از فرم (field name = "file" یا "files")
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) files.push(value);
    }

    if (files.length === 0) {
      return { valid: false, error: "هیچ فایلی برای آپلود ارسال نشده است." };
    }

    // ۴. چک تعداد فایل‌ها
    if (files.length > maxFiles) {
      return {
        valid: false,
        error: `تعداد فایل‌ها بیش از حد مجاز (${maxFiles}) است.`,
      };
    }

    // ۵. اعتبارسنجی هر فایل
    for (const file of files) {
      if (!allowed.includes(file.type)) {
        return {
          valid: false,
          error: `فرمت فایل '${file.name}' مجاز نیست. فقط ${allowed.join(
            ", "
          )} مجازند.`,
        };
      }

      if (file.size > maxSize) {
        const sizeMB = (file.size / 1024 / 1024).toFixed(2);
        return {
          valid: false,
          error: `حجم فایل '${file.name}' (${sizeMB}MB) بیش از حد مجاز (${
            maxSize / 1048576
          }MB) است.`,
        };
      }
    }

    // ۶. همه چیز اوکی ✅
    return { valid: true, files };
  } catch (error) {
    console.error("Upload Validation Error:", error);
    return { valid: false, error: "خطایی هنگام بررسی فایل‌ها رخ داد." };
  }
}

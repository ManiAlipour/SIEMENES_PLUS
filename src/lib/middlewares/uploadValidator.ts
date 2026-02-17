import { NextRequest } from "next/server";

export interface UploadOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
  maxFiles?: number;
}

/**
 * uploadValidator — Validate files before upload
 * @param req - Next.js request containing FormData
 * @param options - Allowed size and file type settings
 * @returns {Promise<{ valid: boolean; error?: string; files?: File[] }>}
 */
export async function uploadValidator(
  req: NextRequest,
  options?: UploadOptions
): Promise<{ valid: boolean; error?: string; files?: File[] }> {
  try {
    // 1. Default settings
    const maxSize = (options?.maxSizeMB ?? 10) * 1024 * 1024; // 10MB default
    const allowed = options?.allowedTypes ?? [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    const maxFiles = options?.maxFiles ?? 3;

    // 2. Check FormData exists
    const formData = await req.formData();
    const files: File[] = [];

    // 3. Extract files from form (field name = "file" or "files")
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) files.push(value);
    }

    if (files.length === 0) {
      return { valid: false, error: "هیچ فایلی برای آپلود ارسال نشده است." };
    }

    // 4. Validate file count
    if (files.length > maxFiles) {
      return {
        valid: false,
        error: `تعداد فایل‌ها بیش از حد مجاز (${maxFiles}) است.`,
      };
    }

    // 5. Validate each file
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

    // 6. All validations passed
    return { valid: true, files };
  } catch (error) {
    console.error("Upload Validation Error:", error);
    return { valid: false, error: "خطایی هنگام بررسی فایل‌ها رخ داد." };
  }
}

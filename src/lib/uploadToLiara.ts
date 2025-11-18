import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";

const s3 = new S3Client({
  region: process.env.CLOUD_REGION,
  endpoint: process.env.CLOUD_ENDPOINT,

  credentials: {
    accessKeyId: process.env.CLOUD_ACCESS_KEY!,
    secretAccessKey: process.env.CLOUD_SECRET_KEY!,
  },
});

/**
 * ✅ آپلود فایل به Liara Object Storage
 * @param file فایل از FormData (نوع File)
 * @param folder پوشه دلخواه برای نظم
 * @returns {Promise<{url: string, key: string}>}
 */
export async function uploadToLiara(file: File, folder = "uploads") {
  if (!file) throw new Error("❌ فایل مشخص نشده است.");

  const bucket = process.env.LIARA_BUCKET || process.env.CLOUD_BUCKET_NAME;
  if (!bucket)
    throw new Error(
      "❌ متغیر LIARA_BUCKET یا CLOUD_BUCKET_NAME تعریف نشده است."
    );

  const uniqueKey = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: uniqueKey,
    Body: buffer,
    ContentType: file.type,
    ACL: "public-read",
    ContentLength: buffer.length,
  });

  // اجرای آپلود
  await s3.send(command);

  // ساخت URL نهایی فایل برای دسترسی عمومی
  const fileUrl = `${process.env.CLOUD_ENDPOINT}/${bucket}/${uniqueKey}`;

  return {
    url: fileUrl,
    key: uniqueKey,
  };
}

/**
 * 🗑️ حذف فایل از Liara Object Storage بر اساس URL یا کلید
 * اگر URL کامل فایل داری، خودش کلید رو استخراج می‌کنه.
 * @param fileUrl URLِ فایل (مثلاً https://storage.liara.ir/mybucket/folder/file.jpg)
 */
export async function deleteFromLiara(fileUrl: string) {
  if (!fileUrl) throw new Error("آدرس فایل برای حذف مشخص نشده است.");

  // مثال: https://storage.liara.ir/mybucket/products/abc.jpg → products/abc.jpg
  const parts = fileUrl.split(`/${process.env.LIARA_BUCKET}/`);
  const key = parts[1];

  if (!key) throw new Error("نتوانستم Key فایل را از URL استخراج کنم.");

  // فرمان حذف
  const command = new DeleteObjectCommand({
    Bucket: process.env.CLOUD_BUCKET_NAME!,
    Key: key,
  });

  await s3.send(command);

  return { success: true, message: "فایل از Liara حذف شد", key };
}

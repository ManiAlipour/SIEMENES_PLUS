import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";

const s3 = new S3Client({
  region: process.env.LIARA_REGION,
  endpoint: process.env.LIARA_ENDPOINT,
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY!,
    secretAccessKey: process.env.LIARA_SECRET_KEY!,
  },
});

/**
 * ✅ آپلود فایل به Liara Object Storage
 * @param file فایل از FormData (نوع File)
 * @param folder پوشه دلخواه برای نظم
 * @returns {Promise<{url: string, key: string}>}
 */
export async function uploadToLiara(file: File, folder = "uploads") {
  // ساخت کلید یکتا برای فایل
  const uniqueKey = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

  // ساخت stream خواندنی برای AWS SDK
  const buffer = Buffer.from(await file.arrayBuffer());
  const stream = Readable.from(buffer);

  // فرمان آپلود
  const command = new PutObjectCommand({
    Bucket: process.env.LIARA_BUCKET!,
    Key: uniqueKey,
    Body: stream,
    ContentType: file.type,
    ACL: "public-read",
  });

  // انجام آپلود
  await s3.send(command);

  // URL نهایی فایل
  const fileUrl = `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET}/${uniqueKey}`;

  return { url: fileUrl, key: uniqueKey };
}

/**
 * 🗑️ حذف فایل از Liara Object Storage بر اساس URL یا کلید
 * اگر URL کامل فایل داری، خودش کلید رو استخراج می‌کنه.
 * @param fileUrl URLِ فایل (مثلاً https://storage.liara.ir/mybucket/folder/file.jpg)
 */
export async function deleteFromLiara(fileUrl: string) {
  if (!fileUrl) throw new Error("آدرس فایل برای حذف مشخص نشده است.");

  // استخراج مسیر داخلی فایل (بعد از نام باکت)
  // مثال: https://storage.liara.ir/mybucket/products/abc.jpg → products/abc.jpg
  const parts = fileUrl.split(`/${process.env.LIARA_BUCKET}/`);
  const key = parts[1];

  if (!key) throw new Error("نتوانستم Key فایل را از URL استخراج کنم.");

  // فرمان حذف
  const command = new DeleteObjectCommand({
    Bucket: process.env.LIARA_BUCKET!,
    Key: key,
  });

  await s3.send(command);

  return { success: true, message: "فایل از Liara حذف شد", key };
}

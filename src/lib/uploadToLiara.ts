import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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

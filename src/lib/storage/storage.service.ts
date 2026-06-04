  import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client";

const bucketName = process.env.CLOUD_BUCKET_NAME;
const publicBaseUrl = process.env.S3_PUBLIC_BASE_URL;

if (!bucketName) {
  throw new Error("S3_BUCKET_NAME is not defined");
}

export type UploadFileOptions = {
  folder?: string;
  key?: string;
};

export type UploadedFileResult = {
  key: string;
  url: string | null;
  fileName: string;
  contentType: string;
  size: number;
};

function sanitizeFileName(fileName: string): string {
  return fileName
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9.\-_]/g, "");
}

function generateFileKey(fileName: string, folder = "uploads"): string {
  const safeFileName = sanitizeFileName(fileName);
  const timestamp = Date.now();

  return `${folder}/${timestamp}-${safeFileName}`;
}

export async function uploadFileToStorage(
  file: File,
  options: UploadFileOptions = {},
): Promise<UploadedFileResult> {
  if (!file) {
    throw new Error("File is required");
  }

  const folder = options.folder || "uploads";
  const fileKey = options.key || generateFileKey(file.name, folder);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
    Body: buffer,
    ContentType: file.type || "application/octet-stream",
  });

  await s3Client.send(command);

  const url = publicBaseUrl ? `${publicBaseUrl}/${fileKey}` : null;

  return {
    key: fileKey,
    url,
    fileName: file.name,
    contentType: file.type || "application/octet-stream",
    size: file.size,
  };
}

export type DeleteFileResult = {
  success: true;
  key: string;
};

export async function deleteFileFromStorage(
  fileKey: string,
): Promise<DeleteFileResult> {
  if (!fileKey) {
    throw new Error("File key is required");
  }

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  });

  await s3Client.send(command);

  return {
    success: true,
    key: fileKey,
  };
}

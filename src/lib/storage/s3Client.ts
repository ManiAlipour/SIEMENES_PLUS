import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import https from "https";

const endpoint = process.env.CLOUD_ENDPOINT;
const accessKeyId = process.env.CLOUD_ACCESS_KEY;
const secretAccessKey = process.env.CLOUD_SECRET_KEY;

if (!endpoint) {
  throw new Error("S3_ENDPOINT is not defined");
}

if (!accessKeyId) {
  throw new Error("S3_ACCESS_KEY_ID is not defined");
}

if (!secretAccessKey) {
  throw new Error("S3_SECRET_ACCESS_KEY is not defined");
}

export const s3Client = new S3Client({
  region: "default",
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  requestHandler: new NodeHttpHandler({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false, // این خط کلید حل مشکل فعلی توست
    }),
  }),
  forcePathStyle: true,
});

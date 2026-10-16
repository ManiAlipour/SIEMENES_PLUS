import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { adminOnly } from "@/lib/middlewares/adminOnly";
export const runtime = "nodejs";
export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const denied = await adminOnly(request); if (denied) return denied;
  const { token } = await params;
  const base = (process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin).replace(/\/+$/, "");
  const png = await QRCode.toBuffer(`${base}/track/${token}`, { errorCorrectionLevel: "H", margin: 1, width: 600 });
  const disposition = new URL(request.url).searchParams.get("download") === "1" ? "attachment" : "inline";
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png", "Content-Disposition": `${disposition}; filename="repair-${token}.png"`, "Cache-Control": "private, max-age=300", "X-Content-Type-Options": "nosniff" } });
}

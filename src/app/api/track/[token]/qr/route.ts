import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import RepairOrder from "@/models/RepairOrder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[a-zA-Z0-9_-]{8,80}$/.test(token)) {
    return NextResponse.json({ message: "لینک پیگیری معتبر نیست." }, { status: 404 });
  }

  await connectDB();
  const exists = await RepairOrder.exists({ trackingToken: token });
  if (!exists) return NextResponse.json({ message: "تعمیر پیدا نشد." }, { status: 404 });

  const configuredBase = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const base = configuredBase.replace(/\/+$/, "");
  const png = await QRCode.toBuffer(`${base}/track/${token}`, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 720,
    color: { dark: "#0b2545", light: "#ffffff" },
  });

  const disposition = new URL(request.url).searchParams.get("download") === "1" ? "attachment" : "inline";
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `${disposition}; filename="repair-${token}.png"`,
      "Cache-Control": "private, max-age=300",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

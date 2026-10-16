import QRCode from "qrcode";

export async function getRepairQrCodeDataUrl(
  trackingToken: string,
): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://siemensplus.ir";
  const trackingUrl = `${baseUrl}/track/${trackingToken}`;

  return await QRCode.toDataURL(trackingUrl, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 280,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });
}

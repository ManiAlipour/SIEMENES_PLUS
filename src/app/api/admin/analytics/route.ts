import { NextResponse } from "next/server";
import { getAdminAnalytics } from "@/lib/admin/analytics";
import { adminOnly } from "@/lib/middlewares/adminOnly";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const isAdmin = await adminOnly(req);

    const data = await getAdminAnalytics();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (err: any) {
    console.error("Admin Analytics API Error:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        details: err.message || "Unexpected error in analytics endpoint",
      },
      { status: 500 }
    );
  }
}

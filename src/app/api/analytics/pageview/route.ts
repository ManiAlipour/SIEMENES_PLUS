import { NextRequest, NextResponse } from "next/server";
import PageView from "@/models/PageView";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export const runtime = "nodejs";

// POST: Log page view
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Get user token if present
    const tokenValue = req.cookies.get("token")?.value;
    let userId: string | null = null;

    if (tokenValue) {
      try {
        const decoded = verifyToken(tokenValue);
        userId = decoded?.id || null;
      } catch (err) {
        userId = null; // Invalid token
      }
    }

    // Get page info
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "درخواست نامعتبر است." },
        { status: 400 }
      );
    }

    const { url, userAgent } = body || {};
    if (!url || !userAgent) {
      return NextResponse.json(
        { ok: false, error: "پارامترهای الزامی ارسال نشده‌اند." },
        { status: 400 }
      );
    }

    // Extract IP (proxy-aware)
    let ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      (req as any).ip ||
      null;

    // Save page view
    await PageView.create({
      url,
      userAgent,
      ip,
      userId,
      timestamp: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    // Return error response
    return NextResponse.json(
      { ok: false, error: err?.message || "خطای سرور" },
      { status: 500 }
    );
  }
}

// GET: Aggregated page view stats summary
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Aggregate views for last 12 months
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Current month/year
    let year = today.getFullYear();
    let month = today.getMonth(); // 0-based

    // Report type
    type ReportRange = { label: string; year: number; month: number };

    // Generate last 12 months range list
    const reports: ReportRange[] = [];
    for (let i = 11; i >= 0; i--) {
      // Handle year rollover
      let m = month - i;
      let y = year;
      while (m < 0) {
        m += 12;
        y -= 1;
      }
      const d = new Date(y, m, 1);
      reports.push({
        label: `${d.getFullYear()}-${(d.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`,
        year: d.getFullYear(),
        month: d.getMonth(),
      });
    }

    // Aggregate views per month
    const viewsByMonth = await Promise.all(
      reports.map(async (r) => {
        const monthStart = new Date(r.year, r.month, 1, 0, 0, 0, 0);
        const monthEnd =
          r.month === 11
            ? new Date(r.year + 1, 0, 1, 0, 0, 0, 0)
            : new Date(r.year, r.month + 1, 1, 0, 0, 0, 0);

        // Some models use createdAt or timestamp
        let count = 0;
        try {
          count = await PageView.countDocuments({
            $or: [
              {
                createdAt: {
                  $gte: monthStart,
                  $lt: monthEnd,
                },
              },
              {
                timestamp: {
                  $gte: monthStart,
                  $lt: monthEnd,
                },
              },
            ]
          });
        } catch {
          count = 0;
        }

        return {
          month: r.label,
          views: count,
        };
      })
    );

    return NextResponse.json({ monthlyViews: viewsByMonth });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "خطای سرور" },
      { status: 500 }
    );
  }
}

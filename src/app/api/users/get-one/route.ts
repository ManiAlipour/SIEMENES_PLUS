import { sanitizeUser, verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "No token provided", success: false },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    const user = (await User.findById(decoded.id)) as User;

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          data: {},
          message: "توکن نامعتبر",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: sanitizeUser(user),
      message: "کاربر یافت شد.",
    });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}

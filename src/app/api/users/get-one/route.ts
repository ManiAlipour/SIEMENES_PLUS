import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    return NextResponse.json({ message: "Token is valid" });
  } catch (error) {
    console.log("error", error);
  }
}

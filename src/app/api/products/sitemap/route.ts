import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const products = await Product.find({}).select("slug").lean();
    return NextResponse.json({
      data: products,
    });
  } catch (error) {
    return NextResponse.json({
      data: [],
    });
  }
}

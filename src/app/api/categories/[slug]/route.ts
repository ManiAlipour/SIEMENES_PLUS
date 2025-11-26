import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await context.params;

    const products = await Product.find({ category: slug });

    return NextResponse.json({
      data: products,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ data: null, success: false }, { status: 500 });
  }
}

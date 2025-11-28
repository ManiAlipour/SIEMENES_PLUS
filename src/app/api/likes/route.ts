import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const { ids } = body;

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ message: "ids اجباری است." }, { status: 400 });
    }

    if (ids.length === 0) {
      return NextResponse.json({ products: [] });
    }

    const productsPromises = ids.map(async (id) => {
      const product = await Product.findById(id);
      return product ? product.toObject() : null;
    });
    const products = (await Promise.all(productsPromises)).filter(
      (p) => p !== null
    );
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching batch products:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

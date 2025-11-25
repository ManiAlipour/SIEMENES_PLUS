import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // Find top categories (6 for example) -- customize as needed
    const topCategories = await Category.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    // For each category, find highlighted products (top 5 for example)
    const highlightedCategories = await Promise.all(
      topCategories.map(async (category) => {
        // Find up to 5 latest products for this category
        const products = await Product.find(
          { category: category._id },
          "name price image"
        )
          .sort({ createdAt: -1 })
          .limit(5)
          .lean();

        // Map products to needed structure
        const productsFormatted = products.map((product) => ({
          id: product._id?.toString(),
          name: product.name,
          price: product.price,
          image: product.image,
        }));

        return {
          id: category._id.toString(),
          title: category.name,
          products: productsFormatted,
        };
      })
    );

    return NextResponse.json({
      message: "هایلایت دسته‌بندی‌ها با موفقیت دریافت شد!",
      data: highlightedCategories,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در دریافت هایلایت دسته‌بندی‌ها" },
      { status: 500 }
    );
  }
}

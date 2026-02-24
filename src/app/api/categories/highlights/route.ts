import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // دسته‌های منتخب (isFeatured) یا در غیر این صورت آخرین دسته‌ها
    const topCategories = await Category.find(
      {},
      "name slug image isFeatured"
    )
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(6)
      .lean();

    // For each category, find highlighted products (top 5 for example)
    const highlightedCategories = await Promise.all(
      topCategories.map(async (category) => {
        // Find up to 5 latest products for this category
        const products = await Product.find(
          { category: category.slug },
          "name image slug brand price"
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
          id: (category._id as string).toString(),
          slug: category.slug,
          title: category.name,
          image: category.image || null,
          products: productsFormatted,
        };
      })
    );

    return NextResponse.json({
      success: true,
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

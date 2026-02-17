import { NextRequest, NextResponse } from "next/server";
import { adminOnly } from "@/lib/middlewares/adminOnly";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { deleteFromLiara, uploadToLiara } from "@/lib/uploadToLiara";
import { productRequestSchema } from "@/lib/validations/productValidator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: { id: string };
}
// DELETE handler
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await adminOnly(request);
    await connectDB();

    const { id } = await context.params;

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "محصول موردنظر یافت نشد" },
        { status: 404 }
      );
    }

    if (product.image && typeof product.image === "string") {
      try {
        await deleteFromLiara(product.image);
      } catch (err) {
        console.error(" خطا در حذف تصویر از Liara:", err);
      }
    }

    await product.deleteOne();

    return NextResponse.json({
      success: true,
      message: " محصول و تصویر آن با موفقیت حذف شدند",
    });
  } catch (error: any) {
    console.error(" DELETE Product error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "خطایی در حذف محصول رخ داده است، لطفاً بعداً تلاش کنید.",
      },
      { status: 500 }
    );
  }
}

//  PUT handler
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await adminOnly(request);
    await connectDB();

    const { id } = await context.params;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "محصول موردنظر یافت نشد" },
        { status: 404 }
      );
    }

    const form = await request.formData();
    const image = form.get("image") as File | null;

    const name = form.get("name")?.toString() || existingProduct.name;
    const slug = form.get("slug")?.toString() || existingProduct.slug;
    const brand = form.get("brand")?.toString() || existingProduct.brand;
    const category =
      form.get("category")?.toString() || existingProduct.category;
    const modelNumber =
      form.get("modelNumber")?.toString() || existingProduct.modelNumber;
    const description =
      form.get("description")?.toString() || existingProduct.description;

    const isFeaturedValue = form.get("isFeatured");
    const isFeatured =
      isFeaturedValue?.toString() === "true" ||
      isFeaturedValue?.toString() === "on";

    const specifications = form.get("specifications")
      ? JSON.parse(form.get("specifications") as string)
      : existingProduct.specifications;

    const parsed = productRequestSchema.partial().parse({
      name,
      slug,
      brand,
      category,
      modelNumber,
      description,
      specifications,
      isFeatured,
    });

    // Update image in Liara storage
    if (image && image.size > 0) {
      try {
        if (existingProduct.image) {
          await deleteFromLiara(existingProduct.image);
        }
      } catch (err) {
        console.warn("⚠️ خطا در حذف تصویر قبلی از Liara:", err);
      }

      const uploaded = await uploadToLiara(image, "products");
      (parsed as any).image = uploaded.url;
    }

    Object.assign(existingProduct, parsed);
    await existingProduct.save();

    return NextResponse.json({
      success: true,
      message: " محصول با موفقیت به‌روزرسانی شد",
      updatedProduct: existingProduct,
    });
  } catch (error: any) {
    console.error(" PUT Product error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "خطایی در ویرایش محصول رخ داده است، لطفاً بعداً تلاش کنید.",
      },
      { status: 500 }
    );
  }
}

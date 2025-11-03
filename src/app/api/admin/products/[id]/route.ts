import { NextRequest, NextResponse } from "next/server";
import { adminOnly } from "@/lib/middlewares/adminOnly";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { deleteFromLiara, uploadToLiara } from "@/lib/uploadToLiara"; // تابع حذف عکس از Liara
import { productRequestSchema } from "@/lib/validations/productValidator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await adminOnly(request);
    await connectDB();

    const { id } = params;

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "محصول موردنظر یافت نشد" },
        { status: 404 }
      );
    }

    // حذف فایل از Liara در صورت وجود URL معتبر
    if (product.image && typeof product.image === "string") {
      try {
        await deleteFromLiara(product.image); // حذف فایل تصویر از Liara (بر اساس URL)
      } catch (err) {
        console.error("❌ خطا در حذف تصویر از Liara:", err);
        // ادامه می‌دهیم حتی اگر حذف فایل شکست بخورد
      }
    }

    // حذف رکورد از دیتابیس
    await product.deleteOne();

    return NextResponse.json({
      success: true,
      message: "✅ محصول و تصویر آن با موفقیت حذف شدند",
    });
  } catch (error: any) {
    console.error("⛔ DELETE Product error:", error);

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
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await adminOnly(request);
    await connectDB();

    const { id } = params;
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "محصول موردنظر یافت نشد" },
        { status: 404 }
      );
    }

    // 📦 استخراج داده‌ها از فرم
    const form = await request.formData();

    const image = form.get("image") as File | null;

    // ✅ تبدیل داده‌ها به stringهای امن برای اعتبارسنجی
    const name = form.get("name")?.toString() || existingProduct.name;
    const slug = form.get("slug")?.toString() || existingProduct.slug;
    const brand = form.get("brand")?.toString() || existingProduct.brand;
    const category =
      form.get("category")?.toString() || existingProduct.category;
    const modelNumber =
      form.get("modelNumber")?.toString() || existingProduct.modelNumber;
    const description =
      form.get("description")?.toString() || existingProduct.description;

    // ⚙️ isFeatured: ایمن در برابر type خطای TS
    const isFeaturedValue = form.get("isFeatured");
    const isFeatured =
      isFeaturedValue?.toString() === "true" ||
      isFeaturedValue?.toString() === "on";

    const specifications = form.get("specifications")
      ? JSON.parse(form.get("specifications") as string)
      : existingProduct.specifications;

    // ✅ اعتبارسنجی داده‌ها — تمام فیلدها اختیاری برای partial update
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

    // 🖼️ اگر عکس جدید اومده: حذف قبلی + آپلود جدید
    if (image && image.size > 0) {
      try {
        if (existingProduct.image) {
          await deleteFromLiara(existingProduct.image);
        }
      } catch (err) {
        console.warn("⚠️ خطا در حذف تصویر قبلی از Liara:", err);
      }

      const uploaded = await uploadToLiara(image, "products");
      // چون schema اولیه احتمالاً image نداره، TS رو با as any خنثی می‌کنیم
      (parsed as any).image = uploaded.url;
    }

    // 🔄 اعمال تغییرات روی مدل موجود
    Object.assign(existingProduct, parsed);
    await existingProduct.save();

    return NextResponse.json({
      success: true,
      message: "✅ محصول با موفقیت به‌روزرسانی شد",
      updatedProduct: existingProduct,
    });
  } catch (error: any) {
    console.error("⛔ PUT Product error:", error);
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

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { adminOnly } from "@/lib/middlewares/adminOnly";
import { uploadToLiara } from "@/lib/uploadToLiara";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { productRequestSchema } from "@/lib/validations/productValidator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await adminOnly(request);

    await connectDB();

    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    const body: Record<string, any> = {};
    formData.forEach((val, key) => {
      if (key === "image") return;
      body[key] = val;
    });

    if (body.specifications && typeof body.specifications === "string") {
      try {
        body.specifications = JSON.parse(body.specifications);
      } catch {
        body.specifications = {};
      }
    }

    if (!("isFeatured" in body)) {
      body.isFeatured = false;
    } else if (typeof body.isFeatured === "string") {
      const val = body.isFeatured.toLowerCase();
      body.isFeatured = val === "true" || val === "on" || val === "1";
    }

    const parsed = productRequestSchema.parse({ body, file });
    const data = parsed.body;

    const existing = await Product.findOne({ slug: data.slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "این اسلاگ از قبل ثبت شده است" },
        { status: 400 }
      );
    }

    let imageUrl: string | null = null;
    if (file) {
      const { url } = await uploadToLiara(file, "products");
      imageUrl = url;
    }

    const newProduct = new Product({
      ...data,
      image: imageUrl,
    });
    await newProduct.save();

    return NextResponse.json(
      {
        success: true,
        message: "✅ محصول با موفقیت اضافه شد",
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("⛔ product POST error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, message: "ورودی نامعتبر است", error: error.format() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "خطایی در سرور رخ داده است، لطفاً مجدداً تلاش کنید.",
      },
      { status: 500 }
    );
  }
}

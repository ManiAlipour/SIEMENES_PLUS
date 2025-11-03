import { NextRequest, NextResponse } from "next/server";
import multer from "multer";
import { ZodError, z } from "zod";
import { adminOnly } from "@/lib/middlewares/adminOnly";
import { uploadToLiara } from "@/lib/uploadToLiara";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { productRequestSchema } from "@/lib/validations/productValidator";

const upload = multer({ storage: multer.memoryStorage() });
const runMiddleware = (req: any, res: any, fn: any) =>
  new Promise((resolve, reject) =>
    fn(req, res, (result: any) =>
      result instanceof Error ? reject(result) : resolve(result)
    )
  );

// تنظیمات لازم برای Multer در محیط App Router
export const config = { api: { bodyParser: false } };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const req = request as any;
  const res = {} as any;

  try {
    await adminOnly(request);
    await connectDB();

    // اجرای multer برای استخراج فایل
    await runMiddleware(req, res, upload.single("image"));
    const file = req.file;
    const fields = req.body;

    // اعتبارسنجی مقادیر
    const parsed = productRequestSchema.parse({ body: fields, file });
    const data = parsed.body;

    // بررسی تکراری نبودن slug
    const existing = await Product.findOne({ slug: data.slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "این اسلاگ از قبل ثبت شده است" },
        { status: 400 }
      );
    }

    // آپلود تصویر به Liara
    const { url } = await uploadToLiara(file, "products");

    // ذخیره محصول
    const newProduct = new Product({
      ...data,
      image: url,
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
        {
          success: false,
          message: "ورودی نامعتبر است",
        },
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

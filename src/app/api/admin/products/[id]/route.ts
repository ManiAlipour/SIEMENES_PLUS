import { NextRequest, NextResponse } from "next/server";
import { adminOnly } from "@/lib/middlewares/adminOnly";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import {
  productRequestSchema,
  productUpdateSchema,
} from "@/lib/validations/productValidator";
import {
  deleteFileFromStorage,
  uploadFileToStorage,
} from "@/lib/storage/storage.service";
import { ZodError } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: { id: string };
}
// DELETE handler
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await adminOnly(request);
    await connectDB();

    const { id } = await context.params;

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "محصول موردنظر یافت نشد" },
        { status: 404 },
      );
    }

    if (product.image && typeof product.image === "string") {
      try {
        await deleteFileFromStorage(product.image);
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
      { status: 500 },
    );
  }
}

//  PUT handler

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await adminOnly(request);
    await connectDB();

    const { id } = await context.params;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "محصول موردنظر یافت نشد" },
        { status: 404 },
      );
    }

    const form = await request.formData();
    const image = form.get("image") as File | null;

    const name =
      form.get("name")?.toString() ?? existingProduct.name ?? undefined;
    const slug =
      form.get("slug")?.toString() ?? existingProduct.slug ?? undefined;
    const brand =
      form.get("brand")?.toString() ?? existingProduct.brand ?? undefined;
    const category =
      form.get("category")?.toString() ?? existingProduct.category ?? undefined;
    const modelNumber =
      form.get("modelNumber")?.toString() ??
      existingProduct.modelNumber ??
      undefined;
    const description =
      form.get("description")?.toString() ??
      existingProduct.description ??
      undefined;

    const isFeaturedValue = form.get("isFeatured");
    const isFeatured =
      isFeaturedValue !== null
        ? isFeaturedValue.toString() === "true" ||
          isFeaturedValue.toString() === "on"
        : existingProduct.isFeatured;

    let specifications = existingProduct.specifications;
    const specificationsRaw = form.get("specifications");

    if (specificationsRaw) {
      try {
        const parsedSpecs = JSON.parse(specificationsRaw.toString());

        if (Array.isArray(parsedSpecs)) {
          specifications = Object.fromEntries(
            parsedSpecs
              .filter(
                (item) =>
                  item &&
                  typeof item === "object" &&
                  typeof item.key === "string" &&
                  typeof item.value === "string",
              )
              .map((item) => [item.key.trim(), item.value.trim()]),
          );
        } else if (
          parsedSpecs &&
          typeof parsedSpecs === "object" &&
          !Array.isArray(parsedSpecs)
        ) {
          specifications = parsedSpecs;
        } else {
          return NextResponse.json(
            {
              success: false,
              message:
                "فرمت specifications باید object یا array از key/value باشد",
            },
            { status: 400 },
          );
        }
      } catch {
        return NextResponse.json(
          {
            success: false,
            message: "فرمت specifications نامعتبر است",
          },
          { status: 400 },
        );
      }
    }

    const parsed = productUpdateSchema.parse({
      name,
      slug,
      brand,
      category,
      modelNumber,
      description,
      specifications,
      isFeatured,
    });

    if (image && image.size > 0) {
      try {
        if (existingProduct.image) {
          await deleteFileFromStorage(existingProduct.image);
        }
      } catch (err) {
        console.warn("خطا در حذف تصویر قبلی از storage:", err);
      }

      const uploaded = await uploadFileToStorage(image, {
        folder: "products",
      });

      if (!uploaded.url) {
        return NextResponse.json(
          {
            success: false,
            message: "آپلود تصویر ناموفق بود",
          },
          { status: 500 },
        );
      }

      parsed.image = uploaded.url;
    }

    Object.assign(existingProduct, parsed);
    await existingProduct.save();

    return NextResponse.json({
      success: true,
      message: "محصول با موفقیت به‌روزرسانی شد",
      updatedProduct: existingProduct,
    });
  } catch (error: unknown) {
    console.error("PUT Product error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "داده‌های ارسالی نامعتبر هستند",
          errors: error.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "خطایی در ویرایش محصول رخ داده است، لطفاً بعداً تلاش کنید.",
      },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { adminOnly } from "@/lib/middlewares/adminOnly";
import Category from "@/models/Category";
import { deleteFromLiara, uploadToLiara } from "@/lib/uploadToLiara";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// DELETE category
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await adminOnly(_request);
    await connectDB();

    const { id } = await context.params;

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, message: "دسته‌بندی موردنظر یافت نشد" },
        { status: 404 }
      );
    }

    if (category.image && typeof category.image === "string") {
      try {
        await deleteFromLiara(category.image);
      } catch (err) {
        console.error("خطا در حذف تصویر از Liara:", err);
      }
    }

    await category.deleteOne();

    return NextResponse.json({
      success: true,
      message: "دسته‌بندی با موفقیت حذف شد",
    });
  } catch (error: unknown) {
    console.error("DELETE Category error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          (error as Error)?.message ||
          "خطایی در حذف دسته‌بندی رخ داده است، لطفاً بعداً تلاش کنید.",
      },
      { status: 500 }
    );
  }
}

// PATCH category (partial update)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await adminOnly(request);
    await connectDB();

    const { id } = await context.params;

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, message: "دسته‌بندی موردنظر یافت نشد" },
        { status: 404 }
      );
    }

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("image") as File | null;

      const name = formData.get("name") as string | null;
      const slug = formData.get("slug") as string | null;
      const parent = formData.get("parent") as string | null;
      const description = formData.get("description") as string | null;
      const isFeaturedRaw = formData.get("isFeatured") as string | null;
      const isFeatured =
        isFeaturedRaw === "true" || isFeaturedRaw === "1";

      if (name != null) category.name = name;
      if (slug != null) {
        const exists = await Category.findOne({ slug, _id: { $ne: id } });
        if (exists)
          return NextResponse.json(
            { success: false, message: "این اسلاگ از قبل برای دسته‌ای دیگر وجود دارد" },
            { status: 400 }
          );
        category.slug = slug;
      }
      if (parent !== undefined) category.parent = parent || undefined;
      if (description !== undefined) category.description = description || undefined;
      if (isFeaturedRaw !== undefined) category.isFeatured = isFeatured;

      if (file && file.size > 0) {
        if (category.image && typeof category.image === "string") {
          try {
            await deleteFromLiara(category.image);
          } catch (err) {
            console.error("خطا در حذف تصویر قبلی از Liara:", err);
          }
        }
        const { url } = await uploadToLiara(file, "categories");
        category.image = url;
      }
    } else {
      const body = await request.json();

      if (body.name != null) category.name = body.name;
      if (body.slug != null) {
        const exists = await Category.findOne({ slug: body.slug, _id: { $ne: id } });
        if (exists)
          return NextResponse.json(
            { success: false, message: "این اسلاگ از قبل برای دسته‌ای دیگر وجود دارد" },
            { status: 400 }
          );
        category.slug = body.slug;
      }
      if (body.parent !== undefined) category.parent = body.parent || undefined;
      if (body.description !== undefined) category.description = body.description || undefined;
      if (body.isFeatured !== undefined) category.isFeatured = body.isFeatured === true;
      if (body.image !== undefined) category.image = body.image || undefined;
    }

    await category.save();

    const { toCategoryDTO } = await import("@/types/category");
    const data = toCategoryDTO({
      _id: category._id,
      name: category.name,
      slug: category.slug,
      parent: category.parent,
      description: category.description,
      image: category.image,
      isFeatured: category.isFeatured,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    });

    return NextResponse.json({
      success: true,
      message: "دسته‌بندی با موفقیت به‌روزرسانی شد",
      data,
    });
  } catch (error: unknown) {
    console.error("PATCH Category error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          (error as Error)?.message ||
          "خطایی در به‌روزرسانی دسته‌بندی رخ داده است.",
      },
      { status: 500 }
    );
  }
}

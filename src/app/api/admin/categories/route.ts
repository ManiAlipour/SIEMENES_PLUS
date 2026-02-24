import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { adminOnly } from "@/lib/middlewares/adminOnly";
import Category from "@/models/Category";
import { uploadToLiara } from "@/lib/uploadToLiara";

export async function POST(request: NextRequest) {
  await adminOnly(request);
  await connectDB();

  try {
    const contentType = request.headers.get("content-type") || "";
    let name = "";
    let slug = "";
    let parent: string | null = null;
    let description = "";
    let imageUrl: string | null = null;
    let isFeatured = false;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("image") as File | null;

      name = (formData.get("name") as string) || "";
      slug = (formData.get("slug") as string) || "";
      parent = (formData.get("parent") as string) || null;
      description = (formData.get("description") as string) || "";
      isFeatured = (formData.get("isFeatured") as string) === "true";

      if (file && file.size > 0) {
        const { url } = await uploadToLiara(file, "categories");
        imageUrl = url;
      }
    } else {
      const body = await request.json();
      name = body.name || "";
      slug = body.slug || "";
      parent = body.parent || null;
      description = body.description || "";
      isFeatured = body.isFeatured === true;
    }

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, message: "نام و شناسه الزامی هستند" },
        { status: 400 }
      );
    }

    const exists = await Category.findOne({ slug });
    if (exists)
      return NextResponse.json(
        { success: false, message: "این اسلاگ از قبل وجود دارد" },
        { status: 400 }
      );

    const cat = new Category({
      name,
      slug,
      parent: parent || undefined,
      description: description || undefined,
      image: imageUrl || undefined,
      isFeatured,
    });
    await cat.save();

    const { toCategoryDTO } = await import("@/types/category");
    const data = toCategoryDTO({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      parent: cat.parent,
      description: cat.description,
      image: cat.image,
      isFeatured: cat.isFeatured,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "خطایی رخ داد" },
      { status: 500 }
    );
  }
}

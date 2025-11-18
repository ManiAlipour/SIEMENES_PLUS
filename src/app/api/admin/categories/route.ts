import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { adminOnly } from "@/lib/middlewares/adminOnly";
import Category from "@/models/Category";

export async function POST(request: Request) {
  await adminOnly(request);
  await connectDB();

  try {
    const body = await request.json();
    const { name, slug, parent, description } = body;

    const exists = await Category.findOne({ slug });
    if (exists)
      return NextResponse.json(
        { success: false, message: "این اسلاگ از قبل وجود دارد" },
        { status: 400 }
      );

    const cat = new Category({ name, slug, parent, description });
    await cat.save();

    return NextResponse.json({ success: true, data: cat }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "خطایی رخ داد" },
      { status: 500 }
    );
  }
}

import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const categories = await Category.find({}, "name slug parent").sort({
      createdAt: -1,
    });

    return NextResponse.json({
      message: "کتگوری ها با موفقیت دریافت شد!",
      data: categories,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در ارتباط با سرور!" },
      { status: 500 }
    );
  }
}

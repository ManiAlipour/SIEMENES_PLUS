import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { authOnly } from "@/lib/middlewares/auth";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { updateProductRating } from "@/lib/reviews/updateProductRating";
import Product from "@/models/Product";
import Review from "@/models/Review";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { message: "شناسه محصول نامعتبر است", success: false },
        { status: 400 },
      );
    }

    const objectId = new mongoose.Types.ObjectId(productId);

    const [reviews, [stats]] = await Promise.all([
      Review.find({ product: objectId, approved: true })
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .lean(),
      Review.aggregate([
        { $match: { product: objectId, approved: true } },
        {
          $group: {
            _id: "$product",
            averageRating: { $avg: "$rating" },
            reviewCount: { $sum: 1 },
          },
        },
      ]),
    ]);

    const averageRating = stats
      ? Math.round(stats.averageRating * 10) / 10
      : 0;
    const reviewCount = stats?.reviewCount ?? 0;

    return NextResponse.json({
      success: true,
      data: reviews.map((r: any) => ({
        _id: r._id,
        rating: r.rating,
        title: r.title || "",
        text: r.text,
        createdAt: r.createdAt,
        user:
          r.user && typeof r.user === "object"
            ? {
                name: r.user.name,
                email: r.user.email,
              }
            : undefined,
      })),
      aggregate: { averageRating, reviewCount },
    });
  } catch {
    return NextResponse.json(
      { message: "خطا در برقراری ارتباط با سرور", data: null, success: false },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const authResult = await authOnly(req);
    if (authResult instanceof NextResponse) return authResult;

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "وارد حساب کاربری شوید", success: false },
        { status: 401 },
      );
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { message: "نشست نامعتبر است", success: false },
        { status: 401 },
      );
    }

    const userData = await User.findById(user.id);
    if (!userData) {
      return NextResponse.json(
        { message: "کاربر یافت نشد", success: false },
        { status: 404 },
      );
    }

    const body = await req.json();
    const productId = String(body.productId || "");
    const rating = Number(body.rating);
    const text = String(body.text || "").trim();
    const title = String(body.title || "").trim().slice(0, 120);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { message: "شناسه محصول نامعتبر است", success: false },
        { status: 400 },
      );
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "امتیاز باید بین ۱ تا ۵ باشد", success: false },
        { status: 400 },
      );
    }

    if (!text || text.length < 5) {
      return NextResponse.json(
        { message: "متن نظر باید حداقل ۵ کاراکتر باشد", success: false },
        { status: 400 },
      );
    }

    if (text.length > 2000) {
      return NextResponse.json(
        { message: "متن نظر بیش از حد طولانی است", success: false },
        { status: 400 },
      );
    }

    const product = await Product.findById(productId).select("_id");
    if (!product) {
      return NextResponse.json(
        { message: "محصول یافت نشد", success: false },
        { status: 404 },
      );
    }

    const existing = await Review.findOne({
      user: userData._id,
      product: productId,
    });

    if (existing) {
      existing.rating = rating;
      existing.text = text;
      existing.title = title;
      existing.approved = true;
      await existing.save();
      await updateProductRating(productId);

      return NextResponse.json({
        message: "نظر شما به‌روزرسانی شد",
        success: true,
        updated: true,
      });
    }

    await Review.create({
      user: userData._id,
      product: productId,
      rating,
      title,
      text,
      approved: true,
    });

    await updateProductRating(productId);

    return NextResponse.json(
      { message: "نظر شما با موفقیت ثبت شد", success: true },
      { status: 201 },
    );
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { message: "شما قبلاً برای این محصول نظر داده‌اید", success: false },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: "خطا در برقراری ارتباط با سرور", success: false },
      { status: 500 },
    );
  }
}

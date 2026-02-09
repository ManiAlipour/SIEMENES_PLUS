import { connectDB } from "@/lib/db";
import { adminOnly } from "@/lib/middlewares/adminOnly";
import User from "@/models/User";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // DB + Auth
    await connectDB();
    await adminOnly(req);

    // Get id
    const { id } = await params;

    // ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه کاربر نامعتبر است",
          data: null,
        },
        { status: 400 },
      );
    }

    //  Parse body correctly
    const body = await req.json();
    const { active } = body;

    if (typeof active !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "مقدار وضعیت کاربر نامعتبر است",
          data: null,
        },
        { status: 400 },
      );
    }

    //  Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { active },
      { new: true },
    ).select("-password");

    // Not found
    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "کاربر یافت نشد",
          data: null,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: active
          ? "کاربر با موفقیت فعال شد"
          : "کاربر با موفقیت مسدود شد",
        data: updatedUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH /admin/users/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطای ناشناخته‌ای رخ داد",
        data: null,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // DB + Auth
    await connectDB();
    await adminOnly(req);

    // Get id 
    const { id } = await params;

    // ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه کاربر نامعتبر است",
          data: null,
        },
        { status: 400 },
      );
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(id);

    // Not found
    if (!deletedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "کاربر یافت نشد",
          data: null,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "کاربر با موفقیت حذف شد",
        data: { id },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /admin/users/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطای ناشناخته‌ای رخ داد",
        data: null,
      },
      { status: 500 },
    );
  }
}

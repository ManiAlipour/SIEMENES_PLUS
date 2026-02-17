import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";
import { adminOnly } from "@/lib/middlewares/adminOnly";

// Set new contact (USER)
export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    // Required: firstName, lastName, email, title, message
    const { firstName, lastName, email, title, message } = data;

    if (!firstName || !lastName || !email || !title || !message) {
      return NextResponse.json(
        { error: "همه فیلدها الزامی هستند." },
        { status: 400 }
      );
    }

    let contactData: any = {
      firstName,
      lastName,
      email,
      title,
      message,
      status: "pending",
      createdAt: new Date(),
    };

    // Assume guest submission; set user to null if User is required
    if (Contact.schema?.paths?.user?.isRequired) {
      contactData.user = null;
    }

    const contact = await Contact.create(contactData);

    return NextResponse.json({
      success: true,
      contact: {
        id: contact._id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        title: contact.title,
        message: contact.message,
        status: contact.status,
        createdAt: contact.createdAt,
        user: contact.user ?? null,
      },
    });
  } catch (err: any) {
    let message = "Server error";
    // Return proper message for ValidationError
    if (err?.name === "ValidationError" && err?.message) {
      message = err.message;
      // Add localization here if needed
      if (message.includes("user: Path `user` is required")) {
        message = "ثبت فرم تماس فقط برای کاربران وارد شده مجاز است.";
      }
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// --- Get all contacts (Admin)---
export async function GET(request: Request) {
  try {
    await connectDB();
    await adminOnly(request);

    const contacts = await Contact.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: contacts.map((c: any) => ({
        id: c._id,
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        title: c.title,
        message: c.message,
        status: c.status,
        createdAt: c.createdAt,
        user: c.user ?? null,
      })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

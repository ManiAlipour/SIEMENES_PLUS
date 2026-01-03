import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";
import { adminOnly } from "@/lib/middlewares/adminOnly";
import { transporter } from "@/lib/auth";

// تابع واقعی ارسال ایمیل با nodemailer
async function sendEmailToUser(to: string, subject: string, body: string) {
  await transporter.sendMail({
    from: `"Control Room" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: body,
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  // صدا زدن adminOnly به صورت تابع و پاس دادن req
  await adminOnly(req);

  try {
    await connectDB();
    const { id } = params;
    const data = await req.json();

    // فیلد الزامی برای پاسخ: answer (پاسخ ادمین)
    const { answer } = data;
    if (!answer) {
      return NextResponse.json(
        { error: "متن پاسخ الزامی است." },
        { status: 400 }
      );
    }

    // پیدا کردن پیام کاربر
    const contact = await Contact.findById(id);
    if (!contact) {
      return NextResponse.json({ error: "پیام پیدا نشد." }, { status: 404 });
    }

    // تغییر وضعیت پیام به answered و ذخیره پاسخ
    contact.status = "answered";
    contact.answer = answer;
    contact.answeredAt = new Date();
    await contact.save();

    // ایمیل زدن به کاربر
    const emailSubject = `پاسخ به پیام شما: ${contact.title}`;
    const emailBody = `
      <p>کاربر گرامی ${contact.firstName} ${contact.lastName},</p>
      <p>پاسخ شما به پیام ارسال شده به شرح زیر است:</p>
      <hr />
      <p><b>پیام شما:</b></p>
      <blockquote style="background:#f5f5f5;padding:8px 12px;border-radius:6px">${contact.message}</blockquote>
      <p><b>پاسخ ادمین:</b></p>
      <blockquote style="background:#e7f8e9;padding:8px 12px;border-radius:6px">${answer}</blockquote>
      <hr />
      <p>با تشکر</p>
    `;
    try {
      await sendEmailToUser(contact.email, emailSubject, emailBody);
    } catch (e) {
      // در صورت اشکال در ارسال ایمیل، لاگ شود اما ادامه پاسخ انجام شود
      console.error("خطا در ارسال ایمیل پاسخ:", e);
    }

    return NextResponse.json({
      success: true,
      message: "پاسخ با موفقیت ثبت و ارسال شد.",
      contact: {
        id: contact._id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        title: contact.title,
        message: contact.message,
        answer: contact.answer,
        status: contact.status,
        createdAt: contact.createdAt,
        answeredAt: contact.answeredAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "خطای سرور. لطفا دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}

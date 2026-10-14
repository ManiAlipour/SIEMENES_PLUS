import { connectDB } from "@/lib/db";
import RepairOrder, { RepairStageType } from "@/models/RepairOrder";
import { sendRepairStatusUpdateSms } from "@/lib/sms";

const STAGE_DEFAULT_DATA: Record<
  RepairStageType,
  { title: string; defaultDesc: string }
> = {
  RECEIVED: {
    title: "دریافت تجهیز",
    defaultDesc: "تجهیز در کارگاه زیمنس پلاس دریافت شد.",
  },
  INITIAL_INSPECTION: {
    title: "بررسی اولیه",
    defaultDesc: "تجهیز جهت شناسایی ایراد توسط کارشناس بررسی شد.",
  },
  REPAIRING: {
    title: "عیب‌یابی و تعمیر",
    defaultDesc: "تجهیز در حال عیب‌یابی تخصصی و تعویض قطعات است.",
  },
  TESTING: {
    title: "تست و تأیید عملکرد",
    defaultDesc: "تجهیز پس از تعمیر اولیه وارد مرحله تست عملکرد شد.",
  },
  READY_TO_DELIVER: {
    title: "آماده ارسال",
    defaultDesc: "تجهیز تعمیر و آماده تحویل به مشتری خواهد بود.",
  },
};

type UpdateRepairStageResult = {
  updatedOrder: any;
  sms: { attempted: boolean; success?: boolean; message?: string };
};

export async function updateRepairStage(
  trackingToken: string,
  newStage: RepairStageType,
  customNote?: string,
): Promise<UpdateRepairStageResult> {
  await connectDB();

  const stageMeta = STAGE_DEFAULT_DATA[newStage];
  if (!stageMeta) {
    throw new Error("مرحله تعمیر نامعتبر است.");
  }

  const now = new Date();

  // ۱) ابتدا سفارش فعلی را می‌خوانیم تا اگر مرحله تغییری نکرده بود، لاگ تکراری نزنیم
  const existing = await RepairOrder.findOne({ trackingToken }).select([
    "currentStage",
    "customerPhone",
    "acceptanceNumber",
    "deviceName",
    "trackingToken",
  ]);

  if (!existing) {
    throw new Error("سفارش تعمیر یافت نشد.");
  }

  // اگر مرحله تغییری نکرده، فقط note/lastUpdatedAt را آپدیت کن (اختیاری)
  const stageChanged = existing.currentStage !== newStage;

  const note = customNote || stageMeta.defaultDesc;

  const updatedOrder = await RepairOrder.findOneAndUpdate(
    { trackingToken },
    {
      $set: {
        currentStage: newStage,
        lastUpdateNote: note,
        lastUpdatedAt: now,
      },
      ...(stageChanged || Boolean(customNote)
        ? {
            $push: {
              stageLogs: {
                stage: newStage,
                title: stageMeta.title,
                description: note,
                updatedAt: now,
              },
            },
          }
        : {}),
    },
    { new: true },
  );

  if (!updatedOrder) {
    throw new Error("سفارش تعمیر یافت نشد.");
  }

  // ۲) ارسال خودکار پیامک فقط وقتی مرحله واقعاً تغییر کرده (پیشنهاد)
  if (!stageChanged) {
    return {
      updatedOrder,
      sms: { attempted: false, message: "مرحله تغییری نکرد؛ پیامک ارسال نشد." },
    };
  }

  try {
    const smsResult = await sendRepairStatusUpdateSms({
      mobile: updatedOrder.customerPhone,
      acceptanceNumber: updatedOrder.acceptanceNumber,
      deviceName: updatedOrder.deviceName,
      statusTitle: stageMeta.title,
      trackingToken: updatedOrder.trackingToken, // مهم: اینجا توکن واقعی سفارش
    });

    return {
      updatedOrder,
      sms: {
        attempted: true,
        success: smsResult.success,
        message: smsResult.message,
      },
    };
  } catch (error) {
    console.error("خطا در ارسال پیامک:", error);
    return {
      updatedOrder,
      sms: { attempted: true, success: false, message: "خطا در ارسال پیامک" },
    };
  }
}

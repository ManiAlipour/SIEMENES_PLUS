// lib/sms.ts

export interface SmsParameter {
  name: string;
  value: string;
}

export interface SendOtpParams {
  mobile: string;
  templateId: number;
  parameters: SmsParameter[];
}

const SMS_API_URL = "https://api.sms.ir/v1/send/verify";

/**
 * تبدیل ارقام فارسی و عربی به انگلیسی و استانداردسازی شماره به فرمت 09xxxxxxxxx
 */
export function normalizeIranMobile(phone: string): string {
  if (!phone) return "";

  // ۱. تبدیل کاراکترهای فارسی و عربی به ارقام انگلیسی
  const faToEnMap: Record<string, string> = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
  };

  let clean = phone
    .trim()
    .replace(/[۰-۹٠-٩]/g, (char) => faToEnMap[char] || char)
    .replace(/\s+/g, "")
    .replace(/-/g, "");

  // ۲. هندل کردن پیشوندهای بین‌المللی
  if (clean.startsWith("+98")) {
    clean = "0" + clean.slice(3);
  } else if (clean.startsWith("0098")) {
    clean = "0" + clean.slice(4);
  } else if (clean.startsWith("98") && clean.length === 12) {
    clean = "0" + clean.slice(2);
  } else if (!clean.startsWith("0") && clean.length === 10) {
    clean = "0" + clean;
  }

  return clean;
}

/**
 * متد پایه ارسال پیامک با الگوی اعتبارسنجی SMS.ir
 */
export async function sendOtpSms({
  mobile,
  templateId,
  parameters,
}: SendOtpParams) {
  const apiKey = process.env.SMS_IR_API_KEY;

  if (!apiKey) {
    console.error(
      "[SMS.ir Error]: کلید SMS_IR_API_KEY در فایل .env تعریف نشده است.",
    );
    return {
      success: false,
      message: "تنظیمات وب‌سرویس پیامک ست نشده است.",
    };
  }

  const formattedMobile = normalizeIranMobile(mobile);

  if (!/^09\d{9}$/.test(formattedMobile)) {
    console.warn(`[SMS.ir Warning]: شماره موبایل نامعتبر است: ${mobile}`);
    return {
      success: false,
      message: "شماره موبایل گیرنده معتبر نیست.",
    };
  }

  try {
    const response = await fetch(SMS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/plain",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        mobile: formattedMobile,
        templateId: templateId,
        parameters: parameters,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.status !== 1) {
      console.error("[SMS.ir Error Response]:", data);
      return {
        success: false,
        status: data?.status,
        message: data?.message || "خطا در ارسال پیامک",
      };
    }

    return {
      success: true,
      data: data.data,
      message: "پیامک با موفقیت ارسال شد.",
    };
  } catch (error) {
    console.error("[SMS.ir Network/Fetch Error]:", error);
    return {
      success: false,
      message: "خطای ارتباط با سرور پیامک",
    };
  }
}

// -------------------------------------------------------------
// توابع اختصاصی پروژه زیمنس پلاس برای تغییر وضعیت تعمیر
// -------------------------------------------------------------

/**
 * ارسال پیامک به هنگام تغییر وضعیت یا مرحله تعمیر
 */
export async function sendRepairStatusUpdateSms({
  mobile,
  acceptanceNumber,
  deviceName,
  statusTitle,
  trackingToken,
}: {
  mobile: string;
  acceptanceNumber: string;
  deviceName: string;
  statusTitle: string;
  trackingToken: string;
}) {
  const templateId = Number(process.env.SMS_IR_TEMPLATE_REPAIR_STATUS_ID || 0);

  if (!templateId) {
    console.error("قالب SMS_IR_TEMPLATE_REPAIR_STATUS_ID تنظیم نشده است.");
    return {
      success: false,
      message: "شناسه قالب پیامک تغییر وضعیت تعریف نشده است.",
    };
  }

  // نام پارامترها با پنل یکی می‌ماند؛ مقدار TRACKING_LINK فقط توکن ۱۴ کاراکتری است.
  // در متن ثابت قالب پنل، قبل از این پارامتر https://siemensplus1.ir/track/ قرار بده.
  const parameters: SmsParameter[] = [
    { name: "ACCEPTANCE_NO", value: acceptanceNumber },
    { name: "DEVICE_NAME", value: deviceName },
    { name: "STATUS_TITLE", value: statusTitle },
    { name: "TRACKING_LINK", value: trackingToken },
  ];

  return await sendOtpSms({
    mobile,
    templateId,
    parameters,
  });
}

/**
 * ارسال پیامک اولیه بلافاصله پس از ثبت پذیرش در کارگاه
 */
export async function sendInitialAcceptanceSms({
  mobile,
  acceptanceNumber,
  deviceName,
  trackingToken,
}: {
  mobile: string;
  acceptanceNumber: string;
  deviceName: string;
  trackingToken: string;
}) {
  const templateId = Number(
    process.env.SMS_IR_TEMPLATE_INITIAL_ACCEPTANCE_ID || 0,
  );

  if (!templateId) {
    console.error("قالب SMS_IR_TEMPLATE_INITIAL_ACCEPTANCE_ID تنظیم نشده است.");
    return {
      success: false,
      message: "شناسه قالب پیامک پذیرش تعریف نشده است.",
    };
  }

  // مقدار TRACKING_LINK توکن ۱۴ کاراکتری است؛ در متن ثابت قالب پنل،
  // https://siemensplus1.ir/track/ را پیش از پارامتر قرار بده.
  const parameters: SmsParameter[] = [
    { name: "ACCEPTANCE_NO", value: acceptanceNumber },
    { name: "DEVICE_NAME", value: deviceName },
    { name: "TRACKING_LINK", value: trackingToken },
  ];

  return await sendOtpSms({
    mobile,
    templateId,
    parameters,
  });
}

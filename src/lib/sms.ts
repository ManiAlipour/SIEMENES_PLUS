interface SmsParameter {
  name: string;
  value: string;
}

interface SendOtpParams {
  mobile: string;
  templateId: number;
  parameters: SmsParameter[];
}

const SMS_API_URL = "https://api.sms.ir/v1/send/verify";

export async function sendOtpSms({
  mobile,
  templateId,
  parameters,
}: SendOtpParams) {
  const apiKey = process.env.SMS_IR_API_KEY;

  if (!apiKey) {
    throw new Error("SMS_IR_API_KEY is not defined in environment variables.");
  }

  const formattedMobile = mobile.trim();

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
        status: data.status,
        message: data.message || "خطا در ارسال پیامک",
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

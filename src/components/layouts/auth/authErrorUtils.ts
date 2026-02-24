/**
 * API error message → user-facing Persian translation map.
 * Used by AuthForm to show friendly messages for auth/signup/verify failures.
 */
const ERROR_TRANSLATIONS: Record<string, string> = {
  "all fields are required": "لطفاً تمام فیلدها را پر کنید",
  "email and password are required": "لطفاً ایمیل و رمز عبور را وارد کنید",
  "email and code are required": "لطفاً ایمیل و کد تأیید را وارد کنید",
  "signup failed": "ثبت‌نام با خطا مواجه شد. لطفاً دوباره تلاش کنید",
  "login failed": "ورود با خطا مواجه شد. لطفاً دوباره تلاش کنید",
  "verification failed": "تأیید حساب با خطا مواجه شد. لطفاً دوباره تلاش کنید",
  "user already exists":
    "این ایمیل قبلاً ثبت‌نام کرده است. لطفاً وارد شوید یا از صفحه فراموشی رمز عبور استفاده کنید",
  "user not found": "کاربری با این ایمیل یافت نشد. لطفاً اطلاعات را بررسی کنید",
  "account not verified": "حساب شما تأیید نشده است. لطفاً ابتدا ایمیل خود را تأیید کنید",
  "invalid credentials": "ایمیل یا رمز عبور اشتباه است. لطفاً دوباره تلاش کنید",
  "invalid verification code": "کد تأیید اشتباه است. لطفاً کد جدید درخواست کنید",
  "verification code expired": "کد تأیید منقضی شده است. لطفاً کد جدید درخواست کنید",
  "password incorrect": "رمز عبور اشتباه است",
  "email incorrect": "ایمیل اشتباه است",
  "email already registered": "این ایمیل قبلاً ثبت‌نام کرده است",
  "email not registered": "این ایمیل ثبت‌نام نکرده است",
  "internal server error": "خطای داخلی سرور. لطفاً بعداً تلاش کنید",
  "server error": "خطای سرور. لطفاً بعداً تلاش کنید",
  unauthorized: "احراز هویت نامعتبر است. لطفاً دوباره وارد شوید",
  forbidden: "شما اجازه دسترسی به این بخش را ندارید",
  "not found": "درخواست یافت نشد",
  "bad request": "درخواست نامعتبر است. لطفاً اطلاعات را بررسی کنید",
  "too many requests": "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی صبر کنید",
  "service unavailable": "سرویس موقتاً در دسترس نیست. لطفاً بعداً تلاش کنید",
  "network error": "خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید",
  "connection timeout": "اتصال به سرور برقرار نشد. لطفاً دوباره تلاش کنید",
  "failed to fetch": "خطا در برقراری ارتباط با سرور",
};

/**
 * Translates a raw error string (from API or catch) to Persian using ERROR_TRANSLATIONS.
 * Tries exact match first, then partial match.
 */
export function translateAuthError(errorMessage: string): string {
  const trimmed = errorMessage.trim();
  const lower = trimmed.toLowerCase();
  if (ERROR_TRANSLATIONS[lower]) return ERROR_TRANSLATIONS[lower];
  for (const [key, value] of Object.entries(ERROR_TRANSLATIONS)) {
    if (lower.includes(key)) return value;
  }
  return trimmed;
}

/**
 * Normalizes unknown errors (string, Error, or API shape) to a single display string.
 */
export function getAuthErrorMessage(error: unknown): string {
  if (typeof error === "string") return translateAuthError(error);
  if (error && typeof error === "object" && "message" in error && typeof (error as Error).message === "string") {
    return translateAuthError((error as Error).message);
  }
  return "خطایی رخ داد. لطفاً دوباره تلاش کنید.";
}

/**
 * Parses a failed Response (e.g. from fetch) and returns a Persian error message.
 * Handles non-JSON responses and status-based fallbacks.
 */
export async function extractAuthErrorFromResponse(res: Response): Promise<string> {
  const contentType = res.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    const statusText =
      res.status === 401 ? "احراز هویت نامعتبر است"
      : res.status === 403 ? "دسترسی غیرمجاز"
      : res.status === 404 ? "یافت نشد"
      : res.status === 500 ? "خطای سرور"
      : res.statusText || "خطای نامشخص";
    return `خطای سرور (${res.status}): ${statusText}`;
  }
  try {
    const json = await res.json();
    let message = "";
    if (json.error) message = translateAuthError(json.error);
    else if (json.message && !json.success) message = translateAuthError(json.message);
    else if (json.errors) {
      const parts = Array.isArray(json.errors)
        ? json.errors.map((e: unknown) => translateAuthError(String(e)))
        : Object.values(json.errors).map((e: unknown) => translateAuthError(String(e)));
      message = parts.join(", ");
    } else {
      if (res.status === 401) message = "ایمیل یا رمز عبور اشتباه است";
      else if (res.status === 403) message = "شما اجازه دسترسی به این بخش را ندارید";
      else if (res.status === 404) message = "درخواست یافت نشد";
      else if (res.status >= 500) message = "خطای سرور. لطفاً بعداً تلاش کنید";
      else message = `خطای سرور: ${res.status}`;
    }
    return message || "خطایی رخ داد. لطفاً دوباره تلاش کنید.";
  } catch {
    const statusText =
      res.status === 401 ? "احراز هویت نامعتبر است"
      : res.status === 403 ? "دسترسی غیرمجاز"
      : res.status === 404 ? "یافت نشد"
      : res.status === 500 ? "خطای سرور"
      : res.statusText || "خطای نامشخص";
    return `خطای سرور (${res.status}): ${statusText}`;
  }
}

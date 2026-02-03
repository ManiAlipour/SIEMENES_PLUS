import SearchQuery from "@/models/SearchQuery";
import { connectDB } from "@/lib/db";

type SearchSource = "products" | "blogs" | "other";

export function normalizeSearchQuery(raw: string): string {
  const s = (raw ?? "")
    .trim()
    .replace(/\s+/g, " ")
    // یکسان‌سازی حروف عربی/فارسی
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    // حذف کاراکترهای نامرئی رایج
    .replace(/[\u200C\u200D\u200E\u200F]/g, "");

  // برای حروف لاتین هم یکدست‌تر
  const lower = s.toLowerCase();

  // محدودیت طول برای جلوگیری از spam/DB bloat
  return lower.slice(0, 200);
}

export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type LogSearchParams = {
  query: string;
  normalizedQuery?: string;
  totalResults?: number;
  source?: SearchSource | string;
  userId?: string | null;
  meta?: Record<string, unknown> | null;
};

/**
 * ثبت سرچ در DB
 * - خطاها را به caller پاس می‌دهد (caller بهتر است swallow کند تا سرچ fail نشود)
 */
export async function logSearchQuery({
  query,
  normalizedQuery,
  totalResults = 0,
  source = "other",
  userId = null,
  meta = null,
}: LogSearchParams) {
  await connectDB();

  const q = (query ?? "").trim();
  if (!q) return;

  const nq = (normalizedQuery ?? normalizeSearchQuery(q)).trim() || null;

  await SearchQuery.create({
    query: q,
    normalizedQuery: nq,
    source,
    userId,
    totalResults,
    meta,
    timestamp: new Date(),
  });
}


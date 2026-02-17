import SearchQuery from "@/models/SearchQuery";
import { connectDB } from "@/lib/db";

type SearchSource = "products" | "blogs" | "other";

export function normalizeSearchQuery(raw: string): string {
  const s = (raw ?? "")
    .trim()
    .replace(/\s+/g, " ")
    // Normalize Arabic/Persian characters
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    // Remove common invisible characters
    .replace(/[\u200C\u200D\u200E\u200F]/g, "");

  // Lowercase for consistency
  const lower = s.toLowerCase();

  // Length limit to prevent spam/DB bloat
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
 * Log search to DB.
 * Passes errors to caller; caller should swallow to avoid failing the search flow.
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


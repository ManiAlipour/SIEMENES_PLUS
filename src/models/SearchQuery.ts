import mongoose, { Schema, model, models } from "mongoose";

/**
 * SearchQuery
 * -----------
 * این کالکشن برای ثبت «سرچ‌های واقعی» کاربران استفاده می‌شود تا در پنل ادمین
 * بتوان top-searches و ترندها را استخراج کرد.
 *
 * نکته: `query` متن خام کاربر است و `normalizedQuery` نسخه نرمال‌شده برای group/aggregation است.
 */
const SearchQuerySchema = new Schema({
  /** متن خام جستجو (trim شده) */
  query: { type: String, required: true },

  /** متن نرمال‌شده (برای group شدن بهتر). اگر مقدار نداشت، در گزارش‌ها fallback به query انجام می‌شود. */
  normalizedQuery: { type: String, default: null },

  /** منبع سرچ (مثلاً products / blogs) */
  source: { type: String, default: "other" },

  /** شناسه کاربر (در صورت وجود توکن معتبر) */
  userId: { type: mongoose.Types.ObjectId, ref: "User", default: null },

  /** تعداد نتایج پیدا شده برای این سرچ */
  totalResults: { type: Number, default: 0 },

  /** اطلاعات اختیاری (فیلترها/سورت/...) */
  meta: { type: Schema.Types.Mixed, default: null },

  /** زمان ثبت */
  timestamp: { type: Date, default: Date.now },
});

SearchQuerySchema.index({ timestamp: -1 });
SearchQuerySchema.index({ normalizedQuery: 1, timestamp: -1 });
SearchQuerySchema.index({ query: 1, timestamp: -1 });
SearchQuerySchema.index({ source: 1, timestamp: -1 });

export default models.SearchQuery || model("SearchQuery", SearchQuerySchema);

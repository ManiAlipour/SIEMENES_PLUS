import mongoose, { Schema, model, models } from "mongoose";

/**
 * SearchQuery
 * -----------
 * Stores real user searches for admin analytics (top searches, trends).
 * `query` is raw user input; `normalizedQuery` is normalized for grouping/aggregation.
 */
const SearchQuerySchema = new Schema({
  /** Raw search text (trimmed) */
  query: { type: String, required: true },

  /** Normalized text for grouping. Falls back to query in reports if empty. */
  normalizedQuery: { type: String, default: null },

  /** Search source (e.g. products, blogs) */
  source: { type: String, default: "other" },

  /** User ID (if valid token present) */
  userId: { type: mongoose.Types.ObjectId, ref: "User", default: null },

  /** Number of results found for this search */
  totalResults: { type: Number, default: 0 },

  /** Optional metadata (filters, sort, etc.) */
  meta: { type: Schema.Types.Mixed, default: null },

  /** Timestamp */
  timestamp: { type: Date, default: Date.now },
});

SearchQuerySchema.index({ timestamp: -1 });
SearchQuerySchema.index({ normalizedQuery: 1, timestamp: -1 });
SearchQuerySchema.index({ query: 1, timestamp: -1 });
SearchQuerySchema.index({ source: 1, timestamp: -1 });

export default models.SearchQuery || model("SearchQuery", SearchQuerySchema);

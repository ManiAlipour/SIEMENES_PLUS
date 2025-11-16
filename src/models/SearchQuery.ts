import mongoose, { Schema, model, models } from "mongoose";

const SearchQuerySchema = new Schema({
  query: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: "User", default: null },
  totalResults: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
});

export default models.SearchQuery || model("SearchQuery", SearchQuerySchema);

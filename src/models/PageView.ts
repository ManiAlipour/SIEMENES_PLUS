import mongoose, { Schema, model, models } from "mongoose";

const PageViewSchema = new Schema({
  url: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: "User", default: null },
  ip: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now },
});

export default models.PageView || model("PageView", PageViewSchema);

import mongoose, { Schema, model, models } from "mongoose";

const InteractionLogSchema = new Schema({
  event: { type: String, required: true }, // e.g. "scroll", "click", "add_to_cart"
  metadata: { type: Object, default: {} },
  userId: { type: mongoose.Types.ObjectId, ref: "User", default: null },
  url: String,
  timestamp: { type: Date, default: Date.now },
});

export default models.InteractionLog ||
  model("InteractionLog", InteractionLogSchema);

import mongoose, { Schema, model, models } from "mongoose";

const ProductViewSchema = new Schema({
  productId: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  userId: { type: mongoose.Types.ObjectId, ref: "User", default: null },
  ip: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now },
});

export default models.ProductView || model("ProductView", ProductViewSchema);

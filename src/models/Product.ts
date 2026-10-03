// src/models/Product.ts
import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    brand: { type: String },
    category: { type: String, index: true },
    modelNumber: { type: String, index: true },
    image: { type: String, default: "" },
    description: { type: String },
    specifications: {
      type: Map,
      of: String,
    },
    isFeatured: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default models.Product || model("Product", productSchema);

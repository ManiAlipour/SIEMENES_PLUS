// src/models/Product.ts
import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    brand: { type: String },
    category: { type: String, index: true },
    modelNumber: { type: String },
    image: { type: String, required: true },
    description: { type: String },
    specifications: {
      type: Map,
      of: String, // مثلا {"ولتاژ": "220V", "جنس": "آلومینیوم"}
    },
    isFeatured: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default models.Product || model("Product", productSchema);

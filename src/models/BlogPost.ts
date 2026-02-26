import mongoose, { Schema, models } from "mongoose";

const embeddedProductSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    slug: { type: String, required: true },
    blockId: { type: String, required: true },
  },
  { _id: false }
);

const BlogPostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      maxlength: 220,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: 400,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    video: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    embeddedProducts: {
      type: [embeddedProductSchema],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
      trim: true,
    },
  },
  { timestamps: true }
);

BlogPostSchema.index({ slug: 1 });
BlogPostSchema.index({ status: 1, createdAt: -1 });
BlogPostSchema.index({ tags: 1 });

const BlogPost = models.BlogPost || mongoose.model("BlogPost", BlogPostSchema);
export default BlogPost;

export function sanitizeBlogPost(post: any) {
  const {
    _id,
    title,
    slug,
    excerpt,
    content,
    coverImage,
    images,
    video,
    status,
    embeddedProducts,
    tags,
    createdAt,
    updatedAt,
  } = post;
  return {
    _id,
    title,
    slug: slug ?? null,
    excerpt: excerpt ?? "",
    content: content ?? "",
    coverImage: coverImage ?? "",
    images: images ?? [],
    video: video ?? "",
    status,
    embeddedProducts: embeddedProducts ?? [],
    tags: Array.isArray(tags) ? tags.filter((t: any) => typeof t === "string" && t.trim()) : [],
    createdAt,
    updatedAt,
  };
}

export function sanitizeBlogPostSummary(post: any) {
  const { _id, title, slug, excerpt, coverImage, video, status, tags, createdAt } =
    post;
  return {
    _id,
    title,
    slug: slug ?? null,
    excerpt: excerpt ?? "",
    coverImage: coverImage ?? "",
    video: video ?? "",
    status,
    tags: Array.isArray(tags) ? tags.filter((t: any) => typeof t === "string" && t.trim()) : [],
    createdAt,
  };
}

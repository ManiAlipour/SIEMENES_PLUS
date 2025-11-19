import mongoose, { Schema, models } from "mongoose";

const PostSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    content: {
      type: String,
      required: true,
      minlength: 10,
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    coverImage: {
      type: String,
      default: "", // can be image path or video url based on mediaType
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
      required: true,
    },
  },
  { timestamps: true }
);

const Post = models.Post || mongoose.model("Post", PostSchema);
export default Post;

// Sanitization remains almost same; add mediaType to output:
export function sanitizePost(post: any) {
  const {
    _id,
    title,
    content,
    likes,
    tags,
    coverImage,
    mediaType,
    status,
    createdAt,
  } = post;
  return {
    _id,
    title,
    content,
    likes,
    tags,
    coverImage,
    mediaType,
    status,
    createdAt,
  };
}

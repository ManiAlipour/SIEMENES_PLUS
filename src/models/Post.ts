import mongoose, { Schema, models } from "mongoose";

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    video: {
      type: String,
      required: true,
      default: "",
    },
  },
  { timestamps: true }
);

const Post = models.Post || mongoose.model("Post", PostSchema);
export default Post;

// Sanitization remains almost same; add mediaType to output:
export function sanitizePost(post: any) {
  const { _id, title, status, video, createdAt } = post;
  return {
    _id,
    title,
    video,
    status,
    createdAt,
  };
}

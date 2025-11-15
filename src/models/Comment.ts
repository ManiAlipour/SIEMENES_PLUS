import mongoose, { Schema, Document, Types } from "mongoose";

/**
 * Interface مدل کامنت‌ها
 */
export interface IComment extends Document {
  user: Types.ObjectId; // آی‌دی کاربری که کامنت گذاشته
  targetType: "post" | "product"; // نوع کامنت (پست یا محصول)
  targetId: Types.ObjectId; // آی‌دی پست یا محصول هدف
  text: string; // متن کامنت
  approved: boolean; // تایید شده توسط ادمین یا نه
  createdAt: Date; // زمان ایجاد
  updatedAt: Date; // آخرین ویرایش
}

/**
 * Schema اصلی کامنت
 */
const CommentSchema = new Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetType: {
      type: String,
      enum: ["post", "product"],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "targetType", // این نکته باعث میشه بسته به نوع، به پست یا محصول وصل بشه
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // ایجاد createdAt و updatedAt خودکار
  }
);

export const sanitizeComment = (comment: IComment) => {
  return {
    _id: comment._id,
    text: comment.text,
    approved: comment.approved,
    targetType: comment.targetType,
    targetId: comment.targetId,
    createdAt: comment.createdAt,
    user:
      typeof comment.user === "object"
        ? {
            _id: (comment.user as any)._id,
            email: (comment.user as any).email,
            name: (comment.user as any).name,
          }
        : comment.user,
  };
};

export default mongoose.models.Comment ||
  mongoose.model<IComment>("Comment", CommentSchema);

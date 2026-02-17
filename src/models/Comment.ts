import mongoose, { Schema, Document, Types } from "mongoose";

/**
 * Comment model interface
 */
export interface IComment extends Document {
  user: Types.ObjectId;
  targetType: "post" | "product";
  targetId: Types.ObjectId;
  text: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Comment schema
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
      refPath: "targetType", // Dynamic ref: resolves to Post or Product based on targetType
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
    timestamps: true, // Auto-generates createdAt and updatedAt
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

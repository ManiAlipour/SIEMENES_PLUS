import { Schema, models, model, Types, Document } from "mongoose";

const ActionTypes = ["PRICE"] as const;
type ActionType = (typeof ActionTypes)[number];

const Channels = ["WHATSAPP", "TELEGRAM", "INSTAGRAM", "CALL"] as const;
type Channel = (typeof Channels)[number];

export interface IUserActionDocument extends Document {
  type: ActionType;
  productId: Types.ObjectId;
  userId?: Types.ObjectId;
  sessionId?: string;
  channel?: Channel;
  meta?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userActionSchema = new Schema<IUserActionDocument>(
  {
    type: { type: String, enum: ActionTypes, required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    sessionId: { type: String, index: true },
    channel: { type: String, enum: Channels, default: "WHATSAPP" },
    meta: { type: Schema.Types.Mixed },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true },
);

userActionSchema.index({ type: 1, productId: 1, createdAt: -1 });
userActionSchema.index({ userId: 1, createdAt: -1 });

const UserAction =
  models.UserAction ||
  model<IUserActionDocument>("UserAction", userActionSchema);

export default UserAction;

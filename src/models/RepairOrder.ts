// models/RepairOrder.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import { nanoid } from "nanoid";

export const REPAIR_STAGES = [
  "RECEIVED",
  "INITIAL_INSPECTION",
  "REPAIRING",
  "TESTING",
  "READY_TO_DELIVER",
] as const;

export type RepairStageType = (typeof REPAIR_STAGES)[number];

export interface IStageLog {
  stage: RepairStageType;
  title: string;
  description: string;
  updatedAt: Date;
}

export interface IRepairImage {
  type: "BEFORE" | "AFTER";
  url: string;
  createdAt: Date;
}

export interface IRepairOrder extends Document {
  trackingToken: string;
  acceptanceNumber: string;
  deviceName: string;
  deviceModel: string;
  customerPhone: string;
  currentStage: RepairStageType;
  receivedAt: Date;
  lastUpdateNote?: string;
  lastUpdatedAt: Date;
  stageLogs: IStageLog[];
  images: IRepairImage[];
  createdAt: Date;
  updatedAt: Date;
}

const StageLogSchema = new Schema<IStageLog>({
  stage: {
    type: String,
    enum: REPAIR_STAGES,
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const RepairImageSchema = new Schema<IRepairImage>({
  type: { type: String, enum: ["BEFORE", "AFTER"], required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const RepairOrderSchema = new Schema<IRepairOrder>(
  {
    trackingToken: {
      type: String,
      unique: true,
      index: true,
      default: () => nanoid(14),
    },
    acceptanceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    deviceName: { type: String, required: true, trim: true },
    deviceModel: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    currentStage: {
      type: String,
      enum: REPAIR_STAGES,
      default: "RECEIVED",
    },
    receivedAt: { type: Date, default: Date.now },
    lastUpdateNote: {
      type: String,
      default: "تجهیز در کارگاه زیمنس پلاس دریافت شد.",
    },
    lastUpdatedAt: { type: Date, default: Date.now },
    stageLogs: [StageLogSchema],
    images: [RepairImageSchema],
  },
  {
    timestamps: true,
  },
);

const RepairOrder: Model<IRepairOrder> =
  mongoose.models.RepairOrder ||
  mongoose.model<IRepairOrder>("RepairOrder", RepairOrderSchema);

export default RepairOrder;

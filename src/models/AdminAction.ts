import { Schema, model, models } from "mongoose";

const AdminActionSchema = new Schema(
  {
    user: { type: String, required: true },
    action: { type: String, required: true },
    entity: { type: String },
    entityName: { type: String },
  },
  { timestamps: true }
);

export default models.AdminAction || model("AdminAction", AdminActionSchema);

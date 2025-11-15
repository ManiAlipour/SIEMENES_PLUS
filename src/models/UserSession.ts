import mongoose, { Schema, model, models } from "mongoose";

const UserSessionSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
  loginAt: { type: Date, default: Date.now },
  logoutAt: { type: Date, default: null },
  ip: String,
  device: String,
  os: String,
  browser: String,
});

export default models.UserSession || model("UserSession", UserSessionSchema);

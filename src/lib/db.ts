import mongoose from "mongoose";

let isConnected = 0; // 0 = disconnected, 1 = connected

export async function connectDB() {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL!);
    isConnected = conn.connections[0].readyState;
    console.log("🟢 MongoDB Connected:", conn.connection.name);
  } catch (err) {
    console.error("🔴 MongoDB Connection Error:", err);
    throw err;
  }
}

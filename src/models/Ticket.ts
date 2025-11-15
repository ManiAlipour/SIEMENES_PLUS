import mongoose, { Schema, models } from "mongoose";

const TicketSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["technical", "account", "billing", "other"],
      default: "other",
    },
    status: {
      type: String,
      enum: ["pending", "answered", "closed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    messages: [
      {
        senderRole: {
          type: String,
          enum: ["user", "admin"],
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        sentAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    answeredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Ticket = models.Ticket || mongoose.model("Ticket", TicketSchema);
export default Ticket;

export function sanitizeTicket(ticket: any) {
  const { _id, title, category, status, priority, messages, createdAt } =
    ticket;
  return { _id, title, category, status, priority, messages, createdAt };
}

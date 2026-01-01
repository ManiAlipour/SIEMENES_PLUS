import mongoose, { Schema, models } from "mongoose";

const ContactSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "answered", "closed"],
      default: "pending",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

const Contact = models.Contact || mongoose.model("Contact", ContactSchema);
export default Contact;

export function sanitizeContact(contact: any) {
  const { _id, firstName, lastName, email, title, message, status, createdAt, user } =
    contact;
  return { _id, firstName, lastName, email, title, message, status, createdAt, user };
}

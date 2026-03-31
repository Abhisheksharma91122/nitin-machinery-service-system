import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // who will see notification
      required: true,
    },
    serviceRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
    },
    message: String,
    isRead: {
      type: Boolean,
      default: false, // unread by default
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
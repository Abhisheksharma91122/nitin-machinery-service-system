import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    content: { type: String, required: true },
    recipients: { type: Number, default: 0 },
    successCount: { type: Number, default: 0 },
    failCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["sending", "completed", "failed"],
      default: "sending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Promotion", promotionSchema);
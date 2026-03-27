import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // 🔗 reference
      required: true,
    },
    machineName: { type: String, required: true },
    problemDescription: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ServiceRequest", serviceRequestSchema);
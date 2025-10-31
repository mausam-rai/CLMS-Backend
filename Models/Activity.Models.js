import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    activityType: {
      type: String,
      enum: ["Social Update", "Client Visit", "Outreach", "Lead Follow Up", "Meeting"],
      required: true,
    },
    details: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Activity = mongoose.model("Activity", activitySchema);

import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const interviewSchema = new Schema(
  {
    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interviewer",
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      default: 60,
    },
    timeZone: {
      type: String,
      required: true,
      default: "Asia/Kolkata",
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "canceled"],
      default: "scheduled",
    },
    interviewType: {
      type: String,
      // enum: ["technical", "behavioral", "system design", "coding"],
      required: true,
    },
    evaluationFormId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EvaluationForm",
    },
    feedback: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Interview = model("Interview", interviewSchema);

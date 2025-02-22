import { Schema, model } from "mongoose";

const interviewSchema = new mongoose.Schema(
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
    meetingLink: { //available only at the time of interview
      type: String,
      required: true,
    },
    jwtToken: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "canceled"],
      default: "scheduled",
    },
    interviewType: {
      type: String,
      enum: ["technical", "behavioral", "system design", "coding"],
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


export const Interviewer = model("Interviewer", interviewerSchema);

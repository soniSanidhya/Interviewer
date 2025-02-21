import { Schema, model } from "mongoose";

const interviewSchema = new Schema(
  {
    interviewId: {
      type: String,
      required: true,
      unique: true,
    },
    interviewerId: {
      type: Schema.Types.ObjectId, // Foreign Key (FK) → Interviewer
      ref: "Interviewer",
      required: true,
    },
    candidateId: {
      type: Schema.Types.ObjectId, // Foreign Key (FK) → Candidate
      ref: "Candidate",
      required: true,
    },
    evaluationFormId: {
      type: Schema.Types.ObjectId, // Foreign Key (FK) → Evaluation Form
      ref: "EvaluationForm",
    },
    scheduledTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Rejected", "Hired"],
      default: "Pending",
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

export const Interview = model("Interview", interviewSchema);

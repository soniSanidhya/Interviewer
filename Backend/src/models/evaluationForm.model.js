import { Schema, model } from "mongoose";

const evaluationFormSchema = new Schema(
  {
    evaluationForm: {
      type: String,
      required: true,
      unique: true,
    },
    interviewerId: {
      type: Schema.Types.ObjectId, // Foreign Key (FK) → Interviewer
      ref: "Interviewer",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

export const EvaluationForm = model("EvaluationForm", evaluationFormSchema);

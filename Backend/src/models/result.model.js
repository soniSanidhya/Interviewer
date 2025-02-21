import { Schema, model } from "mongoose";

const resultSchema = new Schema(
  {
    responseId: {
      type: String, // Unique identifier (Primary Key)
      required: true,
      unique: true,
    },
    interviewId: {
      type: Schema.Types.ObjectId, // Foreign Key (FK) → Interview
      ref: "Interview",
      required: true,
    },
    evaluationFormId: {
      type: Schema.Types.ObjectId, // Foreign Key (FK) → Evaluation Form
      ref: "EvaluationForm",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100, // Adjust as needed
    },
    comments: {
      type: String,
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

export const Result = model("Result", resultSchema);

import { Schema, model } from "mongoose";

const resultSchema = new Schema(
  {
    interviewId: {
      type: Schema.Types.ObjectId, // Foreign Key (FK) → Interview
      ref: "Interview",
      required: true,
    },
    evaluationFormId: {
      type: JSON, 
      required: true,
    },
    score: {
      type: Number,
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

import { Schema, model } from "mongoose";

const candidateSchema = new Schema(
  {
    candidateId: {
      type: String,
      required: true,
      unique: true, // Acts as Primary Key (PK)
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    resumeLink: {
      type: String,
    },
    appliedPosition: {
      type: String,
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

export const Candidate = model("Candidate", candidateSchema);

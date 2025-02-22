import { Schema, model } from "mongoose";

const interviewerSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    company: {
      type: String,
    },
    position: {
      type: String,
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
    role: {
      type: String,
      enum: ["Admin", "Interviewer"],
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

export const Interviewer = model("Interviewer", interviewerSchema);

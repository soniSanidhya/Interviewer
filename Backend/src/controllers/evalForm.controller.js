import mongoose from "mongoose";
import { EvaluationForm } from "../models/evaluationForm.model.js";
import { Interviewer } from "../models/interviewer.model.js";

export const createEvalForm = async (req, res) => {
  try {
    const { interviewerName, evalForm } = req.body;

    if (!interviewerName || !evalForm) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [interviewer] = await Promise.all([
      Interviewer.findOne({ userName: interviewerName }),
    ]);

    if (!interviewer) {
      return res.status(400).json({ message: "Invalid interviewer name" });
    }

    const parsedEvalForm =
      typeof evalForm === "string" ? JSON.parse(evalForm) : evalForm;

    const newEvalForm = await EvaluationForm.create({
      evaluationFormId: new mongoose.Types.ObjectId(),
      interviewerId: interviewer._id,
      evalForm: parsedEvalForm,
    });

    return res.status(201).json({
      message: "Evaluation form created successfully",
      evalForm: newEvalForm,
    });
  } catch (error) {
    console.error("Error creating evaluation form:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

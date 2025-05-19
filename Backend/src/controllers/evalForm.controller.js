import mongoose from "mongoose";
import { EvaluationForm } from "../models/evaluationForm.model.js";
import { Interview } from "../models/interview.model.js";
import { Interviewer } from "../models/interviewer.model.js";
import { Result } from "../models/result.model.js";

export const createEvalForm = async (req, res) => {
  try {
    const { interviewerName,formName, evalForm } = req.body;
    console.log(interviewerName);
    console.log(formName);
    console.log(evalForm);

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
      formName,
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

export const getEvalFormByInterviewId = async (req, res) => {
  try {
    const { interviewId } = req.params;
    // console.log(interviewId);

    if (!interviewId) {
      return res.status(400).json({ message: "Missing interview ID" });
    }

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(400).json({ message: "Missing interview ID" });
    }

    console.log(interview.evaluationFormId);

    const evalForm = await EvaluationForm.findOne({
      _id: interview.evaluationFormId,
    });

    console.log("ev ",evalForm);
     

    if (!evalForm) {
      return res.status(404).json({ message: "Evaluation form not found" });
    }

    return res.status(200).json({ evalForm });
  } catch (error) {
    console.error("Error fetching evaluation form:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAllEvaluationFormByInterviewerId = async (req, res) => {
  const { interviewerId } = req.params;

  if (!interviewerId) {
    return res.status(400).json({ message: "Missing interviewer ID" });
  }

  try {
    const interviewer = await Interviewer.findById(interviewerId);

    if (!interviewer) {
      return res.status(404).json({ message: "Interviewer not found" });
    }

    const evalForms = await EvaluationForm.find({ interviewerId });

    if (!evalForms || evalForms.length === 0) {
      return res
        .status(404)
        .json({ message: "No evaluation forms found for this interviewer" });
    }

    return res.status(200).json({ evalForms });
  } catch (error) {
    console.error("Error fetching evaluation forms:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const saveEvalForm = async (req, res) => {
  const { interviewId } = req.params;
  console.log(interviewId);
  
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ message: "Missing data to save" });
    }

    // Check if a result already exists for this interviewId
    let savedResult = await Result.findOne({ interviewId });

    if (savedResult) {
      // Update the existing result's evaluationFormId (or other relevant fields)
      savedResult.evaluationForm = data;
      await savedResult.save();
      return res.status(200).json({
        message: "Result updated successfully",
        result: savedResult,
      });
    } else {
      // Create a new result
      savedResult = await Result.create({
        interviewId,
        evaluationForm: data,
      });
      return res.status(201).json({
        message: "Result saved successfully",
        result: savedResult,
      });
    }
  } catch (error) {
    console.error("Error saving result:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getSavedEvalFormById = async (req,res)=>{
  try {
    const { interviewId } = req.params;

    if (!interviewId) {
      return res.status(400).json({ message: "Missing interview ID" });
    }

    const result = await Result.findOne({ interviewId });

    if (!result) {
      return res.status(404).json({ message: "No saved evaluation form found for this interview" });
    }

    return res.status(200).json({ result });
  } catch (error) {
    console.error("Error fetching saved evaluation form:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }




}

export const saveNotes = async (req, res) => {
  const { interviewId } = req.params;
  try {
    const { notes } = req.body;
    if (!notes) {
      return res.status(400).json({ message: "Missing notes to save" });
    }

    let savedResult = await Result.findOne({ interviewId });

    if (savedResult) {
      savedResult.notes = notes;
      await savedResult.save();
      return res.status(200).json({
        message: "Notes updated successfully",
        result: savedResult,
      });
    } else {
      savedResult = await Result.create({
        interviewId,
        notes,
      });
      return res.status(201).json({
        message: "Notes saved successfully",
        result: savedResult,
      });
    }
  } catch (error) {
    console.error("Error saving notes:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const saveSecurityLogs = async (req, res) => {
  const { interviewId } = req.params;
  try {
    const { securityLogs } = req.body;
    if (!securityLogs) {
      return res.status(400).json({ message: "Missing security logs to save" });
    }

    let savedResult = await Result.findOne({ interviewId });

    if (savedResult) {
      savedResult.securityLogs = securityLogs;
      await savedResult.save();
      return res.status(200).json({
        message: "Security logs updated successfully",
        result: savedResult,
      });
    } else {
      savedResult = await Result.create({
        interviewId,
        securityLogs,
      });
      return res.status(201).json({
        message: "Security logs saved successfully",
        result: savedResult,
      });
    }
  } catch (error) {
    console.error("Error saving security logs:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


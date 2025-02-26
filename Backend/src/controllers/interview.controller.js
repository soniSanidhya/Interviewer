import { Candidate } from "../models/candidate.model.js";
import { Interview } from "../models/interview.model.js";
import { Interviewer } from "../models/interviewer.model.js";
import mongoose from "mongoose";

export const scheduleInterview = async (req, res) => {
  const {
    interviewerUserName,
    candidateUserName,
    date,
    time,
    duration,
    timeZone,
    interviewType,
    evaluationFormId,
  } = req.body;

  if (
    !interviewerUserName ||
    !candidateUserName ||
    !date ||
    !time ||
    !duration ||
    !timeZone ||
    !interviewType ||
    !evaluationFormId
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const interviewer = await Interviewer.findOne({
    userName: interviewerUserName,
  });
  const candidate = await Candidate.findOne({ userName: candidateUserName });

  if (!interviewer || !candidate) {
    return res
      .status(400)
      .json({ message: "Invalid interviewer or candidate" });
  }

  const interviewerId = interviewer._id;
  const candidateId = candidate._id;
  const scheduledAt = date;
  const durationMinutes = duration;

  const jwtToken = "dummy-jwt-token";

  const meetingLink = `https://meet.google.com/${interviewerUserName}`;

  const newInterview = {
    interviewerId,
    candidateId,
    scheduledAt,
    durationMinutes,
    timeZone,
    meetingLink,
    jwtToken,
    interviewType,
    evaluationFormId,
  };

  const createdInterview = await Interview.create(newInterview);

  if (!createdInterview) {
    return res.status(400).json({ message: "Error creating interview" });
  }

  return res.status(201).json({
    message: "Interview scheduled successfully",
    interview: createdInterview,
  });
};

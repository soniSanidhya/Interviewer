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
  const scheduledAt = `${date}T${time}:00.000Z`;
  // console.log("Date is ", date);

  const durationMinutes = duration;

  const newInterview = {
    interviewerId,
    candidateId,
    scheduledAt,
    durationMinutes,
    timeZone,
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

export const AccessInterview = async (req, res) => {
  // ✅ Extract interviewId from route params
  const { interviewId } = req.params;
  // console.log("AccessInterview called with interviewId:", interviewId);

  try {
    // ✅ Validate interview existence
    // console.log("Validating interview existence...");
    const isValidInterview = await isInterviewValid(interviewId);
    if (!isValidInterview) {
      // console.log("Invalid or expired interview");
      return res.status(400).json({ message: "Invalid or expired interview" });
    }

    // ✅ Check if req.user is available
    // console.log("Checking if user is authenticated...");
    if (!req.user) {
      // console.log("Unauthorized access: No user found in request");
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }
    // console.log("Authenticated user:", req.user);

    // ✅ Check if the user has access to the interview
    if (req.user.type === "interviewer") {
      // console.log("User is an interviewer. Validating access...");
      // console.log("isValidInterview",isValidInterview);
      // console.log("userID",req.user._id.toString());
      
      const aValidInterview = await Interview.findById(interviewId);
      if (!aValidInterview) {
        // console.log("Interview not found");
        return res.status(404).json({ message: "Interview not found" });
      }

      if (aValidInterview.interviewerId.toString() !== req.user._id.toString()) {
        // console.log("Access denied: Interviewer does not match");
        return res.status(403).json({ message: "Forbidden: No access to this interview" });
      }

      // console.log("Access granted: Valid interviewer");
      return res.status(200).json({
        message: "Valid interviewer",
        type: "interviewer",
        interviewId: aValidInterview._id,
      });
    }

    if (req.user.type === "candidate") {
      // console.log("User is an candidate. Validating access...");
      // console.log("isValidInterview",isValidInterview);
      // console.log("userID",req.user._id.toString());
      
      const aValidInterview = await Interview.findById(interviewId);
      if (!aValidInterview) {
        // console.log("Interview not found");
        return res.status(404).json({ message: "Interview not found" });
      }

      if (aValidInterview.candidateId.toString() !== req.user._id.toString()) {
        // console.log("Access denied: candidate does not match");
        return res.status(403).json({ message: "Forbidden: No access to this interview" });
      }

      // console.log("Access granted: Valid candidate");
      return res.status(200).json({
        message: "Valid candidate",
        type: "candidate",
        interviewId: aValidInterview._id,
      });
    }

    // console.log("Invalid user type:", req.user.type);
    return res.status(400).json({ message: "Invalid user type" });
  } catch (error) {
    console.error("Error accessing interview:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const isInterviewValid = async (id) => {
  const interviewId = id;
  const timeZoneOffset = 5.5 * 60 * 60 * 1000; // Offset for IST (UTC+5:30)

  // Fetch the interview details
  const interview = await Interview.findById(interviewId);
  if (!interview) {
    console.error("Interview not found");
    return false;
  }else{
    // console.log("Interview found");
  }

  // Extract relevant details
  const scheduledAt = interview.scheduledAt.getTime();
  const durationMs = interview.durationMinutes * 60 * 1000;
  const endTime = scheduledAt + durationMs;

  // Adjust current time for the time zone
  const currentTime = Date.now() + timeZoneOffset;

  // Calculate remaining time
  const remainingTime = endTime - currentTime;

  // Log the details
  // console.log("Start time is:", scheduledAt);
  // console.log("Total duration is:", durationMs);
  // console.log("End time is:", endTime);
  // console.log("Current time (adjusted) is:", currentTime);
  // console.log("Remaining time is:", remainingTime, "ms");

  // Check if the current time is within the interview time slot
  const isWithinInterviewTime =
    currentTime > scheduledAt && currentTime < endTime;
  // console.log("Is within interview time:", isWithinInterviewTime);

  // Additional check to display a user-friendly message
  if (isWithinInterviewTime) {
    console.log(
      `Interview is ongoing. Time remaining: ${Math.floor(
        remainingTime / (60 * 1000)
      )} minutes.`
    );
    return true;
  } else if (currentTime < scheduledAt) {
    //log 
    // console.log("hello");
    
    console.log(
      `Interview has not started yet. It will start in ${Math.floor(
        (scheduledAt - currentTime) / (60 * 1000)
      )} minutes.`
    );
    return false;
  } else {
    // console.log("Interview has already ended.");
    return false;
  }
};

export const getInterviews = async (req,res)=>{
  const {id} = req.params

  if(!id){
    res.status(501).json({ message: "ID NOT FOUND" })
  }

  try {
    const interviews = await Interview.find({
      $or: [{ interviewerId: id }],
    });

    if (!interviews || interviews.length === 0) {
      return res.status(404).json({ message: "No interviews found" });
    }

    return res.status(200).json({ message: "Interviews retrieved successfully", interviews });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return res.status(500).json({ message: "Server error" });
  }
}


export const getInterview = async (req,res)=>{
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Candidate ID not provided" });
  }
  // console.log(id);
  
  try {
    const interviews = await Interview.find({
      candidateId: id,
    });

    if (!interviews || interviews.length === 0) {
      return res.status(404).json({ message: "No interviews found for the candidate" });
    }

    return res.status(200).json({ message: "Interviews retrieved successfully", interviews });
  } catch (error) {
    console.error("Error fetching interviews for candidate:", error);
    return res.status(500).json({ message: "Server error" });
  }
}


export const getInterviewByID = async (req, res) => {
  const { interviewID } = req.body;

  if (!interviewID) {
    return res.status(400).json({ message: "Interview ID not provided" });
  }

  try {
    const interview = await Interview.findById(interviewID);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    return res.status(200).json({ message: "Interview retrieved successfully", interview });
  } catch (error) {
    console.error("Error fetching interview by ID:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
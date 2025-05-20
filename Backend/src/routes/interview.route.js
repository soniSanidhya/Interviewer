import { Router } from "express";
import {
  getInterviews,
  scheduleInterview,
  getInterview,
  getInterviewByID,
  AccessInterview,
  markAsCompleted,
  getResultByInterviewId,
} from "../controllers/interview.controller.js";
import { verifyJWT } from "../middlewares/Backend/src/middlewares/auth.middleware.js";
const app = Router();

app.post("/schedule-interview", verifyJWT, scheduleInterview);

app.get("/view-interviews-for-interviewer/:id", verifyJWT, getInterviews);

app.get("/view-interview-for-candidate/:id", verifyJWT, getInterview);
// app.post("/access-interview/:token", accessInterview)

app.post("/getInterview", verifyJWT, getInterviewByID);

app.post("/access-interview/:interviewId", verifyJWT, AccessInterview);

app.get("/markascomplete/:interviewId", verifyJWT, markAsCompleted);

app.post("/getresult/:interviewId", verifyJWT, getResultByInterviewId);

export default app;

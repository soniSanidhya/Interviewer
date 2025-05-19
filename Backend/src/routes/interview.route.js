import { Router } from "express";
import { getInterviews, scheduleInterview, getInterview, getInterviewByID , AccessInterview, markAsCompleted, getResultByInterviewId} from "../controllers/interview.controller.js";
import { verifyJWT } from "../middlewares/Backend/src/middlewares/auth.middleware.js.js";
const app = Router();

app.use(verifyJWT)

app.post("/schedule-interview", scheduleInterview);

app.get("/view-interviews-for-interviewer/:id", getInterviews)

app.get("/view-interview-for-candidate/:id", getInterview)
// app.post("/access-interview/:token", accessInterview)

app.post("/getInterview",getInterviewByID)

app.post("/access-interview/:interviewId", AccessInterview);

app.post("/markascomplete/:interviewId", markAsCompleted);

app.post("/getresult/:interviewId",getResultByInterviewId);

export default app;
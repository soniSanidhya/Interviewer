import { Router } from "express";
import { scheduleInterview } from "../controllers/interview.controller.js";
const app = Router();

app.post("/schedule-interview", scheduleInterview);

export default app;
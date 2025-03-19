import { Router } from "express";
import { scheduleInterview } from "../controllers/interview.controller.js";
const app = Router();

app.post("/schedule-interview", scheduleInterview);

// app.post("/access-interview/:token", accessInterview)

export default app;
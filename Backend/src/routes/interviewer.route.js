import { Router } from "express";
import {
  interviewerLogin,
  interviewerSignup,
} from "../controllers/interviewer.controller.js";

const app = Router();

app.post("/interviewer-signup", interviewerSignup);

app.post("/interviewer-login", interviewerLogin);

export default app;

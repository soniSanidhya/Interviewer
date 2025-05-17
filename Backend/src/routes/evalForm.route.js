import { Router } from "express";
import {
  createEvalForm,
  getEvalFormByInterviewId,
  getAllEvaluationFormByInterviewerId,
  getSavedEvalFormById,
  saveEvalForm,
} from "../controllers/evalForm.controller.js";
import { verifyJWT } from "../middlewares/Backend/src/middlewares/auth.middleware.js.js";

const app = Router();

app.use(verifyJWT);

app.post("/create-evalForm", createEvalForm);

app.post("/getEvalForm/:interviewId", getEvalFormByInterviewId);

app.post(
  "/getAllEvaluationFormByInterviewerId/:interviewerId",
  getAllEvaluationFormByInterviewerId
);

app.post("/getSavedEvalFormById/:interviewId", getSavedEvalFormById);

app.post("/saveEvalForm/:interviewId", saveEvalForm);

export default app;

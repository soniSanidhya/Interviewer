import { Router } from "express";
import { createEvalForm, getEvalFormByInterviewId } from "../controllers/evalForm.controller.js";
import { verifyJWT } from "../middlewares/Backend/src/middlewares/auth.middleware.js.js";

const app = Router();

app.use(verifyJWT)

app.post("/create-evalForm", createEvalForm);

app.post("/getEvalForm/:interviewId",getEvalFormByInterviewId);

export default app;

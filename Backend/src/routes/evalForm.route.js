import { Router } from "express";
import { createEvalForm } from "../controllers/evalForm.controller.js";

const app = Router();

app.post("/create-evalForm", createEvalForm);

export default app;

import { Router } from "express";
import { candidateSignup } from "../controllers/candidate.controller.js";

const app = Router();

app.post("/candidate-signup", candidateSignup);

app.get("/candidate-login");

export default app;

import { Router } from "express";
import { candidateLogin, candidateSignup } from "../controllers/candidate.controller.js";

const app = Router();

app.post("/candidate-signup", candidateSignup);

app.get("/candidate-login", candidateLogin);

export default app;

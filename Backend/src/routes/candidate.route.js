import { Router } from "express";
import { candidateLogin, candidateSignup } from "../controllers/candidate.controller.js";
import { verifyJWT } from "../middlewares/Backend/src/middlewares/auth.middleware.js.js";

const app = Router();

app.post("/candidate-signup", candidateSignup);

app.post("/candidate-login", candidateLogin);

export default app;

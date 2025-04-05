import { Router } from "express";
import { check } from "../controllers/healthcheck.controller.js";
import { verifyJWT } from "../middlewares/Backend/src/middlewares/auth.middleware.js.js";
import { getCurrentUser } from "../controllers/interviewer.controller.js";

const app = Router();

app.post("/check/:paramData", verifyJWT, check);

app.post("/getCurrentUser",verifyJWT,getCurrentUser)

export default app;

import { Router } from "express";
import { check } from "../controllers/healthcheck.controller.js";
import { verifyJWT } from "../middlewares/Backend/src/middlewares/auth.middleware.js.js";

const app = Router();

app.post("/check/:paramData", verifyJWT, check);

export default app;

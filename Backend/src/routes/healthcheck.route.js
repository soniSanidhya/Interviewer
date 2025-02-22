import { Router } from "express";
import { check } from "../controllers/healthcheck.controller.js";

const app = Router();

app.post("/check/:paramData", check);

export default app;

import { Router } from "express";
import { executeCode } from "../controllers/codeexec.controller.js";

const app = Router();

app.post("/exec-code",executeCode);

export default app;
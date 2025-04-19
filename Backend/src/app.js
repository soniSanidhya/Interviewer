import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import healthRoute from "./routes/healthcheck.route.js";
import multer from "multer";
import interviewerRoute from "./routes/interviewer.route.js";
import candidateRoute from "./routes/candidate.route.js";
import evalFormRoute from "./routes/evalForm.route.js";
import interviewRoute from "./routes/interview.route.js";

const app = express();
// Middleware
app.use(cookieParser());
app.use(express.json({ limit: "10mb" })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Support form data
console.log("Client URl : ", process.env.CLIENT_URL);
const allowedOrigins = [
  "http://localhost:5173",
  "https://interviewer-v1-fcsr.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


const upload = multer();
app.use(upload.none());

app.use("/api", healthRoute);
app.use("/api", interviewerRoute);
app.use("/api", candidateRoute);
app.use("/api", evalFormRoute);
app.use("/api", interviewRoute);
export { app };




// app.js (Express App Configuration)

// The app.js file is responsible for setting up and configuring the Express application. It includes:
// Middleware (e.g., cookieParser, cors, express.json) for handling requests.
// Route mounting where different route files are attached under /api.
// Exporting the configured app so it can be used in index.js.

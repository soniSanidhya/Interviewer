import dotenv from "dotenv";
import {app} from "./app.js";
import connectDB from "./config/db.config.js";
import { fn } from "../test.js";
import mongoose from "mongoose";

dotenv.config({ path: "./.env" });

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      // console.log(`Server running at http://localhost:${PORT}`);
    });

    // fn()
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();

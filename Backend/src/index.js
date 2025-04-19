import dotenv from "dotenv";
import {app} from "./app.js";
import connectDB from "./config/db.config.js";
import { fn } from "../test.js";

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

// index.js (Entry Point & Server Startup)
// The index.js file is the main entry point of the application. It:

// Loads environment variables using dotenv.config().
// Connects to the database before starting the server.
// Starts the Express server, ensuring it only runs if the database connection is successful.

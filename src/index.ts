import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { CONNECTDB } from "./config";
import { MainRouter } from "./routes";

// Load environment variables
dotenv.config();

const app = express();

const startServer = async () => {
  try {
    // Connect to the database
    await CONNECTDB();

    // Middlewares
    app.use(express.json());
    app.use(cookieParser());

    // Routes
    app.use(MainRouter);

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server started on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();

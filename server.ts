import dotenv from "dotenv";

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

//! To run the backend for DEVELOPMENT -> npm run server
//! To run the backend for PRODUCTION -> npm start

import express, { Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import connectDB from "./config/db";
import { clerkWebhook } from "./controllers/webhooks.js";

const app = express();

// DB
connectDB();

// Webhook routes:
app.post(
  "/webhooks/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhook,
);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Backend Server is Live! 🚀");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

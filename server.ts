import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db.js";

const app = express();

// Database Connection:
connectDB();

// Middlewares:
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Backend Server is Live! 🚀");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import notesRoutes from "./routes/notesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import connectDB from "./config/db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/quiz", quizRoutes);

connectDB().then(() => {
  app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
  });
});

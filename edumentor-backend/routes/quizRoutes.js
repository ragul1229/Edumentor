// routes/quizRoutes.js
import express from "express";
import { generateQuiz, submitQuiz, getProgress } from "../controllers/quizController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", verifyToken, generateQuiz);
router.post("/submit", verifyToken, submitQuiz);
router.get("/progress", verifyToken, getProgress);

export default router;

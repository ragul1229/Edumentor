import express from "express";
import { generateQuiz } from "../controllers/quizController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // adjust path if needed

const router = express.Router();

// Protect these routes with verifyToken
router.post("/generate", verifyToken, generateQuiz);

export default router;

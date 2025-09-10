import express from "express";
import { uploadNote, getNotes, deleteNote } from "../controllers/noteController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", verifyToken, upload.single("note"), uploadNote);
router.get("/", verifyToken, getNotes);
router.delete("/:id", verifyToken, deleteNote);

export default router;

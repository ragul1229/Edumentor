import express from "express";
import multer from "multer";
import { uploadNote, getNotes, deleteNote } from "../controllers/noteController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Routes
router.post("/upload", upload.single("notesFile"), uploadNote);
router.get("/", getNotes);
router.delete("/:id", deleteNote); // ✅ DELETE route

export default router;

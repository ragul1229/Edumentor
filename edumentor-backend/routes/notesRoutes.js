import express from "express";
import multer from "multer";
import { uploadNote } from "../controllers/noteController.js";


const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// THIS FIELD NAME MUST MATCH FRONTEND
router.post("/upload", upload.single("notesFile"), uploadNote);

export default router;

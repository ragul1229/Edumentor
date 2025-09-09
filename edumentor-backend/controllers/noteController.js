import Note from "../models/Note.js";
import fs from "fs";
import path from "path";
import pdf from "pdf-parse-fixed";
import axios from "axios";

// Upload & summarize
export const uploadNote = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    console.log("File received:", req.file.filename);

    const ext = path.extname(req.file.originalname).toLowerCase();
    if (ext !== ".pdf") {
      return res.status(400).json({ message: "Only PDF files are supported for summarization." });
    }

   const pdfPath = path.join(process.cwd(), "uploads", req.file.filename);
const dataBuffer = fs.readFileSync(pdfPath);

let inputText = "";
try {
  const pdfData = await pdf(dataBuffer);
  inputText = pdfData.text.trim();
  if (!inputText) {
    return res.status(400).json({ message: "PDF has no readable text" });
  }
} catch (err) {
  console.error("PDF parse error:", err.message || err);
  return res
    .status(400)
    .json({ message: "Cannot extract text from this PDF. It may be scanned or corrupted." });
}

const maxLength = 2000;
const truncatedText = inputText.length > maxLength ? inputText.substring(0, maxLength) : inputText;

// Hugging Face API call here...


    let summary = "No summary generated";
    try {
      const summaryRes = await axios.post(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        { inputs: truncatedText },
        { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
      );

      if (Array.isArray(summaryRes.data) && summaryRes.data[0]?.summary_text) {
        summary = summaryRes.data[0].summary_text;
      } else if (summaryRes.data.error) {
        summary = summaryRes.data.error;
      }
    } catch (err) {
      console.error("HF API call failed:", err.response?.data || err.message);
      summary = "Failed to summarize this PDF";
    }

    const note = new Note({
      filename: req.file.filename,
      originalName: req.file.originalname,
      user: req.user?.id || null,
      summary,
    });

    await note.save();

    res.status(200).json({ message: "File uploaded & summarized successfully", note, summary });
  } catch (err) {
    console.error("Upload/Summarize error:", err.response?.data || err.message || err);
    res.status(500).json({ message: "Error uploading or summarizing note" });
  }
};


// Get all notes
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({}).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    console.error("GetNotes error:", err);
    res.status(500).json({ message: "Error fetching notes" });
  }
};

// Delete note
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params; // ✅ make sure we use req.params.id
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const filePath = path.join(process.cwd(), "uploads", note.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await Note.findByIdAndDelete(id);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Error deleting note" });
  }
};

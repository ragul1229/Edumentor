import fs from "fs";
import path from "path";
import pdf from "pdf-parse-fixed";
import axios from "axios";
import Note from "../models/Note.js";

// Helper to split text into chunks if needed
const chunkText = (text, maxLength = 1000) => {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.slice(start, start + maxLength));
    start += maxLength;
  }
  return chunks;
};

export const uploadNote = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Save Note metadata
    const note = new Note({
      filename: req.file.filename,
      originalName: req.file.originalname,
    });
    await note.save();

    // Read PDF
    const pdfPath = path.join(process.cwd(), "uploads", req.file.filename);
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdf(dataBuffer);
    const extractedText = pdfData.text;

    // Split text into chunks for large PDFs
    const chunks = chunkText(extractedText, 1000);
    const summaries = [];

    for (const chunk of chunks) {
      const summaryRes = await axios.post(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        { inputs: chunk },
        { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
      );

      if (Array.isArray(summaryRes.data) && summaryRes.data[0]?.summary_text) {
        summaries.push(summaryRes.data[0].summary_text);
      } else if (summaryRes.data.error) {
        summaries.push(summaryRes.data.error);
      }
    }

    const finalSummary = summaries.join(" ");

    // Send response
    res.status(200).json({
      message: "File uploaded & summarized successfully",
      note,
      summary: finalSummary,
    });
  } catch (err) {
    console.error("Upload/Summarize error:", err);
    res.status(500).json({ message: "Error uploading or summarizing note" });
  }
};

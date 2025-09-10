// src/components/NotesAndQuiz.js
import { useState } from "react";
import axios from "axios";
import QuizSection from "./QuizSection";

function NotesAndQuiz() {
  const [file, setFile] = useState(null);
  const [noteId, setNoteId] = useState(null);
  const [summary, setSummary] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");

    const formData = new FormData();
    formData.append("note", file);

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/notes/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSummary(res.data.summary);   // show summary immediately
      setNoteId(res.data.note._id);   // store noteId for quiz
      alert("File uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-xl font-bold">Upload Notes</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-2"
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
      >
        {uploading ? "Uploading..." : "Upload Note"}
      </button>

      {summary && (
        <div className="mt-4 p-2 border rounded bg-gray-50">
          <h3 className="font-semibold">Note Summary:</h3>
          <p>{summary}</p>
        </div>
      )}

      {/* QuizSection gets the noteId automatically */}
      {noteId && <QuizSection noteId={noteId} />}
    </div>
  );
}

export default NotesAndQuiz;

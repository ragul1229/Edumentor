import React, { useState } from "react";
import axios from "axios";

function NotesUpload({ setSummary, setNoteId }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

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

      console.log("Upload success:", res.data);
      setSummary(res.data.summary);   // show summary immediately
      setNoteId(res.data.note._id);   // store noteId for quiz
      alert("File uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      alert("Upload failed. Please login again if the issue persists.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center justify-center space-y-4">
      <h2 className="text-xl font-semibold text-blue-600">📤 Upload Your Notes</h2>

      {/* Drag & Drop / File Input */}
      <label className="w-full border-2 border-dashed border-blue-300 p-6 rounded-lg text-center cursor-pointer hover:border-blue-400 transition">
        {file ? (
          <p className="text-gray-700 font-medium">{file.name}</p>
        ) : (
          <p className="text-gray-400">
            Drag & drop your file here, or click to select
          </p>
        )}
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`w-full bg-blue-500 text-white py-2 rounded-lg font-medium shadow hover:bg-blue-600 transition ${
          uploading ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}

export default NotesUpload;

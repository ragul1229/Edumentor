import { useState } from "react";
import axios from "axios";

function NotesUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file first");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/notes/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert(res.data.message);
      setSelectedFile(null);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-96 flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-700">Upload Your Notes</h2>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="border border-gray-300 p-2 rounded"
      />

      {selectedFile && (
        <p className="text-gray-600 text-sm">Selected file: {selectedFile.name}</p>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition ${
          uploading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}

export default NotesUpload;

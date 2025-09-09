import { useState } from "react";
import axios from "axios";

const NotesUpload = ({ setSummary }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // ← loading state

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("notesFile", file);

    try {
      setLoading(true); // start loading
      const res = await axios.post(
        "http://localhost:5000/api/notes/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSummary(res.data.summary); // send summary to Dashboard
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button
        onClick={handleUpload}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        disabled={loading} // prevent multiple clicks
      >
        {loading ? "Summarizing..." : "Upload & Summarize"}
      </button>

      {/* Optional spinner */}
      {loading && (
        <div className="mt-2 flex items-center">
          <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-blue-600">Generating summary...</span>
        </div>
      )}
    </div>
  );
};

export default NotesUpload;

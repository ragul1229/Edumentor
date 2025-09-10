import { useState, useEffect } from "react";
import axios from "axios";

function NotesHistory({ setSummary }) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setNotes(res.data);
      } catch (err) {
        console.error("Fetch failed:", err.response || err.message);
      }
    };

    fetchNotes();
  }, []);

  // ✅ delete function
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // remove from state
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Delete failed:", err.response || err.message);
      alert("Delete failed. Try again.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {notes.length === 0 ? (
        <p className="text-gray-500">No notes uploaded yet.</p>
      ) : (
        notes.map((note) => (
          <div
            key={note._id}
            className="p-2 border rounded flex justify-between items-center"
          >
            <span>{note.originalName}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSummary(note.summary)}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                View Summary
              </button>
              <button
                onClick={() => handleDelete(note._id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default NotesHistory;

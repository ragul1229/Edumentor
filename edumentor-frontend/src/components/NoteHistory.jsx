import { useEffect, useState } from "react";
import axios from "axios";

function NotesHistory() {
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      console.log("Deleting note ID:", noteId); // ✅ debug
      await axios.delete(`http://localhost:5000/api/notes/${noteId}`);
      setNotes(notes.filter((note) => note._id !== noteId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      {notes.length === 0 && <p>No notes uploaded yet.</p>}
      {notes.map((note) => (
        <div key={note._id} className="note-card">
          <p><strong>{note.originalName}</strong></p>
          <p>{note.summary}</p>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded"
            onClick={() => handleDelete(note._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default NotesHistory;

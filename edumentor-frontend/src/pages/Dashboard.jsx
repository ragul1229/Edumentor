import { useState, useEffect } from "react";
import NotesUpload from "../components/NotesUpload";
import NotesHistory from "../components/NoteHistory";
import QuizSection from "../components/QuizSection";

function Dashboard() {
  const [user, setUser] = useState({ name: "" });
  const [summary, setSummary] = useState("");
  const [noteId, setNoteId] = useState(null); // track selected note for quiz

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 p-6">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-white shadow-md p-5 rounded-xl mb-8 border border-gray-100">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-700">
          EduMentor Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow transition"
        >
          Logout
        </button>
      </nav>

      {/* Welcome Section */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
          Welcome back,{" "}
          <span className="text-blue-600 font-bold">{user.name}</span>!
        </h2>
        <p className="text-gray-500 mt-2">
          Manage your notes, generate quizzes, and track your progress with ease.
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {/* Notes Upload */}
        <section className="bg-white border border-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col h-full">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">
            📤 Upload Notes
          </h3>
          <NotesUpload setSummary={setSummary} setNoteId={setNoteId} />
        </section>

        {/* Summarized Notes */}
        <section className="bg-white border border-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col h-full">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">
            📝 Summarized Notes
          </h3>
          {summary ? (
            <div className="p-4 border rounded-lg bg-blue-50 max-h-72 overflow-y-auto text-gray-700 leading-relaxed flex-1">
              {summary}
            </div>
          ) : (
            <p className="text-gray-500 italic flex-1">
              Your summarized notes will appear here.
            </p>
          )}
        </section>

        {/* Quiz Section */}
        <section className="bg-white border border-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col h-full">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">🎯 Quizzes</h3>
          <QuizSection noteId={noteId} />
        </section>

        {/* Progress Tracker */}
        <section className="bg-white border border-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col h-full">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">
            📊 Progress Tracker
          </h3>
          <p className="text-gray-500 italic flex-1">
            Monitor your learning progress and track completed quizzes.
          </p>
        </section>

        {/* Notes History */}
        <section className="bg-white border border-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col col-span-1 md:col-span-2 lg:col-span-3">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">
            📚 Your Notes History
          </h3>
          <NotesHistory setSummary={setSummary} setNoteId={setNoteId} />
        </section>
      </div>
    </div>
  );
}

export default Dashboard;

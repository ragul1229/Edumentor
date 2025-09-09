import { useState, useEffect } from "react";
import NotesUpload from "../components/NotesUpload";
import NotesHistory from "../components/NoteHistory";

function Dashboard() {
  const [user, setUser] = useState({ name: "" });
  const [summary, setSummary] = useState("");

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-white shadow-lg p-4 rounded-xl">
        <h1 className="text-2xl font-bold text-blue-700 tracking-wide">
          EduMentor Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </nav>

      {/* Welcome Section */}
      <div className="mt-6 mb-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          Welcome back, <span className="text-blue-600">{user.name}</span>!
        </h2>
        <p className="text-gray-500 mt-1">Manage your notes, quizzes, and progress here.</p>
      </div>

      {/* Dashboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Notes Upload */}
        <section className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">Upload Notes</h3>
          <NotesUpload setSummary={setSummary} />
        </section>

        {/* Summarized Notes */}
        <section className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">Summarized Notes</h3>
          {summary ? (
            <textarea
              value={summary}
              readOnly
              rows={10}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <p className="text-gray-400 italic">Your summarized notes will appear here after uploading a PDF.</p>
          )}
        </section>

        {/* Quiz Section */}
        <section className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">Quizzes</h3>
          <p className="text-gray-500 italic">Generate or attempt quizzes from your notes here.</p>
        </section>

        {/* Progress Tracker */}
        <section className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">Progress Tracker</h3>
          <p className="text-gray-500 italic">Monitor your learning progress and track completed quizzes.</p>
        </section>

        {/* Notes History */}
        <section className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 col-span-1 md:col-span-2 lg:col-span-3">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">Your Notes History</h3>
          <NotesHistory />
        </section>
      </div>
    </div>
  );
}

export default Dashboard;

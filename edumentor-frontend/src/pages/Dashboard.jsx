import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NotesUpload from "../components/NotesUpload";
import NotesHistory from "../components/NoteHistory";
import QuizSection from "../components/QuizSection";
import ProgressTracker from "../components/ProgressTracker";

function Dashboard() {
  const [user, setUser] = useState({ name: "" });
  const [summary, setSummary] = useState("");
  const [noteId, setNoteId] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-100 to-blue-200 p-6">
      
      {/* Top Navbar */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-10 bg-white/70 backdrop-blur-lg shadow-md border rounded-xl px-6 py-4 flex items-center justify-between mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome, <span className="text-blue-600">{user.name || "User"}</span> 👋
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
        >
          Logout
        </motion.button>
      </motion.header>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Notes Upload + Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Notes Upload */}
            <motion.section
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="card"
            >
              <h3 className="card-title">📤 Upload Notes</h3>
              <NotesUpload setSummary={setSummary} setNoteId={setNoteId} />
            </motion.section>

            {/* Summarized Notes */}
            <motion.section
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="card"
            >
              <h3 className="card-title">📝 Summarized Notes</h3>
              {summary ? (
                <motion.div
                  key={summary} // re-animates on update
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="p-5 border rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 max-h-72 overflow-y-auto text-gray-700 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50"
                >
                  {summary}
                </motion.div>
              ) : (
                <p className="text-gray-500 italic text-center py-10">
                  Your summarized notes will appear here.
                </p>
              )}
            </motion.section>
          </div>

          {/* Quiz Section */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card"
          >
            <h3 className="card-title">🎯 Quiz Zone</h3>
            <QuizSection
              noteId={noteId}
              onQuizSubmit={() => setQuizSubmitted((prev) => !prev)}
            />
          </motion.section>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Progress Tracker */}
          <motion.section
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="card"
          >
            <h3 className="card-title">📊 Progress Tracker</h3>
            <ProgressTracker refreshTrigger={quizSubmitted} />
          </motion.section>

          {/* Notes History */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card h-full"
          >
            <h3 className="card-title">📚 Notes History</h3>
            <NotesHistory setSummary={setSummary} setNoteId={setNoteId} />
          </motion.section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

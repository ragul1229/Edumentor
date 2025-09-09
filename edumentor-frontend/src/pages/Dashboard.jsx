import { useState, useEffect } from "react";
import NotesUpload from "../components/NotesUpload";

function Dashboard() {
  const [user, setUser] = useState({ name: "" });
  const [summary, setSummary] = useState(""); // ← lifted state

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
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-white shadow-md p-4 rounded">
        <h1 className="text-2xl font-bold text-blue-600">
          EduMentor Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </nav>

      {/* Welcome Section */}
      <div className="mt-6 mb-4">
        <h2 className="text-xl font-semibold">Welcome, {user.name}!</h2>
      </div>

      {/* Dashboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notes Upload */}
        <section className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2 text-blue-600">Upload Notes</h3>
          {/* pass setSummary to child */}
          <NotesUpload setSummary={setSummary} />
        </section>
        {/* Summarized Notes */}
        <section className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2 text-blue-600">Summarized Notes</h3>
          {summary ? (
            <textarea
              value={summary}
              readOnly
              rows={10}
              cols={50}
              className="w-full p-2 border rounded"
            />
          ) : (
            <p className="text-gray-500">
              Your summarized notes will appear here.
            </p>
          )}
        </section>
        {/* Quiz Section */}{" "}
        <section className="bg-white p-4 rounded shadow">
          {" "}
          <h3 className="font-semibold mb-2 text-blue-600">Quizzes</h3>{" "}
          {/* <Quiz /> */}{" "}
          <p className="text-gray-500">Take or view quizzes here.</p>{" "}
        </section>
        {/* Progress Tracker */}{" "}
        <section className="bg-white p-4 rounded shadow">
          {" "}
          <h3 className="font-semibold mb-2 text-blue-600">
            Progress Tracker
          </h3>{" "}
          {/* <ProgressTracker /> */}{" "}
          <p className="text-gray-500">Track your learning progress here.</p>{" "}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;

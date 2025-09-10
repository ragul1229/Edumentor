import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import NotesAndQuiz from "./components/NotesAndQuiz"; // import your component

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage setToken={setToken} />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />
        {/* Direct route to Notes & Quiz (optional) */}
        <Route
          path="/notes-quiz"
          element={token ? <NotesAndQuiz /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;

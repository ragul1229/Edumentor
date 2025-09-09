import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="bg-white shadow-lg rounded-xl p-10 text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to EduMentor 🎓
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Your AI-powered study assistant. Upload notes, generate quizzes, and track progress — all in one place.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

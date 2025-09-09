import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to EduMentor 🎓</h1>
      <p className="text-lg max-w-xl text-center mb-8">
        Your AI-powered study assistant. Upload notes, generate quizzes, and track progress — all in one place.
      </p>
      <div className="flex gap-4">
        <Link to="/login">
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200">
            Login
          </button>
        </Link>
        <Link to="/register">
          <button className="bg-indigo-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-900">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;

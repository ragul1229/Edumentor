import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";

function LoginPage({ setToken }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-md">
        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login to EduMentor
        </h2>

        {/* Login Form */}
        <LoginForm setToken={setToken} />

        {/* Register Link */}
        <p className="text-center text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

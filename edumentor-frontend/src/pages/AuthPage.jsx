// src/pages/AuthPage.jsx
import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

function AuthPage({ setToken }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-extrabold text-blue-600 mb-6">EduMentor</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-80 flex flex-col gap-4">
        {showLogin ? (
          <LoginForm setToken={setToken} />
        ) : (
          <RegisterForm />
        )}

        <p className="text-center text-gray-600 mt-2">
          {showLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-blue-600 hover:underline ml-1"
            onClick={() => setShowLogin(!showLogin)}
          >
            {showLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;

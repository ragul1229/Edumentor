import LoginForm from "../components/LoginForm";

function LoginPage({ setToken }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Login to EduMentor</h2>
        <LoginForm setToken={setToken} />
      </div>
    </div>
  );
}

export default LoginPage;

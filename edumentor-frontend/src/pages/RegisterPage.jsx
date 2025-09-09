import RegisterForm from "../components/RegisterForm";

function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Create an Account</h2>
        <RegisterForm />
      </div>
    </div>
  );
}

export default RegisterPage;

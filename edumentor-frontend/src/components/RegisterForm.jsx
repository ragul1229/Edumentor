import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterForm({ setToken }) {
  const [username, setUsername] = useState(""); // renamed
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        username, // ✅ must match backend
        email,
        password,
      });

      console.log("Register success:", res.data);

      // Save token in localStorage
      localStorage.setItem("token", res.data.token);
      if (setToken) setToken(res.data.token);

      // Redirect to login or dashboard
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Username"
        value={username} // ✅ renamed
        onChange={(e) => setUsername(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <button type="submit" className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">
        Register
      </button>
    </form>
  );
}

export default RegisterForm;

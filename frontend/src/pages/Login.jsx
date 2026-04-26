import { useState } from "react";
import API from "../services/api";

export default function Login({ setPage, setAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      alert("Enter email & password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setAuth(true);
      setPage("create");

    } catch (err) {
      alert(err?.response?.data?.error || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100">

      {/* CARD */}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 border border-gray-200">

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Welcome Back 👋
        </h2>

        {/* Email */}
        <input
          placeholder="Email address"
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        <div className="text-center text-gray-400 my-4">or</div>

        {/* Register */}
        <button
          onClick={() => setPage("register")}
          className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Create new account
        </button>

      </div>
    </div>
  );
}
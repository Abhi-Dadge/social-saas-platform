import { useState } from "react";
import API from "../services/api";

export default function Register({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    if (!email || !password) {
      alert("Enter email & password");
      return;
    }

    try {
      await API.post("/auth/register", {
        email,
        password
      });

      alert("Registered successfully ✅");
      setPage("login");

    } catch (err) {
      console.error("REGISTER ERROR:", err.response?.data || err.message);

      alert(
        err.response?.data?.error ||
        "Registration failed ❌"
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl mb-4">Register</h2>

        <input
          placeholder="Email"
          className="border w-full p-2 mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border w-full p-2 mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={register}
          className="bg-green-600 text-white w-full py-2"
        >
          Register
        </button>

        <button
          onClick={() => setPage("login")}
          className="text-blue-600 underline w-full mt-2"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
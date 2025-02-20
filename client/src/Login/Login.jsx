import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("https://taskm-2-l0zo.onrender.com/login", form);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      navigate("/");
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring focus:ring-indigo-300"
          />

          
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} 
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring focus:ring-indigo-300"
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

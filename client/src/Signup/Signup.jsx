import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match");

    // email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/;
    if (!emailRegex.test(form.email)) {
      return setError("Email must be a valid Gmail or Yahoo address.");
    }

    // password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,90}$/;
    if (!passwordRegex.test(form.password)) {
      return setError("Password must contain at least one uppercase letter, one digit, and no special characters.");
    }

    setLoading(true);
    setError("");

    try {
      await axios.post("https://taskm-2-l0zo.onrender.com/signup", form);
      alert("Signup successful! Please log in.");
      setForm({ username: "", email: "", password: "", confirmPassword: "" });
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Error signing up");
    } finally {
      setLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Sign Up</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring focus:ring-indigo-300"
          />
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
            <span onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring focus:ring-indigo-300"
            />
            <span onClick={toggleConfirmPasswordVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500">
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" disabled={loading} className="w-full p-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400">
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;

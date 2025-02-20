import React from "react";
import { Link } from "react-router-dom";
import { FaTasks, FaBookOpen, FaUserLock } from 'react-icons/fa';  // Adding icons

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white">
    <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold mb-6 animate__animated animate__fadeIn">
            Welcome to Your Personal Task and Book Manager!
          </h1>
          <p className="text-xl mb-10 animate__animated animate__fadeIn animate__delay-1s">
            An intuitive app designed to help you manage your daily tasks and personal book collection effortlessly.
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="inline-block bg-blue-600 text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="inline-block bg-green-600 text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all">
            <FaTasks className="text-5xl text-blue-500 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800">Task Management</h3>
            <p className="mt-4 text-gray-600">
              Keep track of all your tasks, mark them as complete, and never miss a deadline!
            </p>
          </div>
          
          <div className="text-center bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all">
            <FaBookOpen className="text-5xl text-yellow-500 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800">Book Collection</h3>
            <p className="mt-4 text-gray-600">
              Manage your personal book collection with descriptions and ratings.
            </p>
          </div>
          
          <div className="text-center bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all">
            <FaUserLock className="text-5xl text-purple-500 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800">Secure Login</h3>
            <p className="mt-4 text-gray-600">
              Your data is safe with our secure login system. Access your personalized dashboard anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

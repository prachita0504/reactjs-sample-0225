import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [profilePic, setProfilePic] = useState(
    localStorage.getItem("profilePic") || "/default-avatar.png"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to update state when localStorage changes
    const updateUserData = () => {
      setUsername(localStorage.getItem("username"));
      setProfilePic(localStorage.getItem("profilePic") || "/default-avatar.png");
    };

    updateUserData(); // Ensure it updates on mount

    // Check for localStorage changes every second
    const interval = setInterval(updateUserData, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("profilePic");

    setUsername(null);
    setProfilePic("/default-avatar.png");
    setIsSidebarOpen(false);

    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <div>
      <nav className="bg-gray-800 text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-3xl font-bold text-blue-600 hover:text-gray-400 transition duration-300"
          >
            TaskM
          </Link>

          <button
            onClick={toggleSidebar}
            className="text-3xl font-bold text-white hover:text-gray-400 transition duration-300"
          >
            ☰
          </button>
        </div>

        <div className="flex items-center gap-4">
          {username ? (
            <div className="relative flex items-center gap-2 cursor-pointer">
              <img
                src={profilePic}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg transition transform hover:scale-110"
              />
              <p className="text-xl font-semibold">{username}</p>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-4 py-2 border border-white text-white hover:bg-gray-700 rounded-md transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 transition text-white rounded-md"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 cursor-pointer"
            onClick={toggleSidebar}
          ></div>
        )}

        <div className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg p-6 rounded-r-xl transition-all duration-300 ease-in-out">
          <button
            onClick={toggleSidebar}
            className="text-white text-3xl mb-8 hover:text-gray-400"
          >
            ✖
          </button>
          <div className="space-y-6">
            <Link
              to="/Dashboard"
              className="block px-6 py-2 text-lg font-semibold hover:bg-gray-700 rounded-md transition duration-200"
              onClick={toggleSidebar}
            >
              📊 Dashboard
            </Link>
            <Link
              to="/todos"
              className="block px-6 py-2 text-lg font-semibold hover:bg-gray-700 rounded-md transition duration-200"
              onClick={toggleSidebar}
            >
              ✅ Todos
            </Link>
            <Link
              to="/books"
              className="block px-6 py-2 text-lg font-semibold hover:bg-gray-700 rounded-md transition duration-200"
              onClick={toggleSidebar}
            >
              📚 Books
            </Link>
            <Link
              to="/UserSettings"
              className="block px-6 py-2 text-lg font-semibold hover:bg-gray-700 rounded-md transition duration-200"
              onClick={toggleSidebar}
            >
              ⚙️ Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full px-6 py-2 mt-6 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

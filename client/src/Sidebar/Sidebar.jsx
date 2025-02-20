import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);


  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex">
      
      <div
        className={`bg-gray-900 text-white h-screen p-5 transition-all ${isOpen ? "w-64" : "w-16"}`}
      >

        <button onClick={toggleSidebar} className="text-white mb-4">
          {isOpen ? "Close" : "Open"} Sidebar
        </button>


        <Link to="/todos" className="block p-2 rounded-md hover:bg-gray-700">
          Todos
        </Link>
        <Link to="/books" className="block p-2 rounded-md hover:bg-gray-700">
          Books
        </Link>
        <Link to="/login" className="block p-2 rounded-md hover:bg-gray-700">
          Login
        </Link>
        <Link to="/signup" className="block p-2 rounded-md hover:bg-gray-700">
          Signup
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

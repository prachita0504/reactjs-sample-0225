import React from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaGithub } from "react-icons/fa"; // Ensure react-icons is installed

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-white py-15 ">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">

        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-xl font-bold text-blue-400">TaskM</h2>
          <p className="text-gray-400 text-sm">Organize your life, one task at a time.</p>
        </div>


        <div className="flex space-x-6 mb-4 md:mb-0">
          <Link to="/" className="text-gray-300 hover:text-blue-400 transition">
            Home
          </Link>
          <Link to="/todos" className="text-gray-300 hover:text-blue-400 transition">
            Todos
          </Link>
          <Link to="/books" className="text-gray-300 hover:text-blue-400 transition">
            Books
          </Link>
        </div>

        <div className="flex space-x-4 mt-4 md:mt-0">
          <a
            href="https://x.com/Prachita05"
            className="text-gray-300 hover:text-blue-400 transition text-2xl"
            target="_blank"
            
          >
            <FaTwitter />
          </a>
          <a
            href="https://github.com/prachita0504"
            className="text-gray-300 hover:text-blue-400 transition text-2xl"
            target="_blank"
            
          >
            <FaGithub />
          </a>
        </div>
      </div>


      <div className="text-center text-gray-500 text-sm mt-4">
        &copy; {new Date().getFullYear()} Task Manager. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

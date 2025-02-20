import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./navbar/navbar";
import Home from "./Home"; 
import Login from "./Login/Login";
import SignUp from "./Signup/Signup"
import Todos from "./Todos/Todos";
import Books from "./Books/Books";
import UserSettings from "./UserSettings/UserSettings";
import Footer from "./Footer";
import Dashboard from "./Dashboard/Dashboard"

function App() {
  const [user, setUser] = useState("");

  // Check if the user is logged in 
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setUser(username); 
    }
  }, []);

  return (
    <Router>
      <Navbar user={user} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/books" element={<Books />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/UserSettings" element={<UserSettings />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Todos = () => {
  const [task, setTask] = useState("");
  const [body, setBody] = useState("");
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) fetchTodo();
  }, [token]);

  const fetchTodo = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/todo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(data);
      setStatus({ type: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Error fetching todos!" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim() || !body.trim()) {
      setStatus({ type: "error", message: "All fields are required!" });
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_URL}/todo`,
        { title: task, body },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, data]);
      setTask("");
      setBody("");
      setStatus({ type: "success", message: "Task added successfully! ✅" });
      setTimeout(() => setStatus({ type: "", message: "" }), 2000);
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Error adding task!" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/todo/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((t) => t._id !== id));
      setStatus({ type: "success", message: "Task deleted successfully!" });
      setTimeout(() => setStatus({ type: "", message: "" }), 2000);
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Error deleting task!" });
    }
  };

  const handleUpdate = async (id, newTitle, newBody) => {
    try {
      await axios.put(
        `${API_URL}/todo/${id}`,
        { title: newTitle, body: newBody },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map((t) => (t._id === id ? { ...t, title: newTitle, body: newBody } : t)));
      setStatus({ type: "success", message: "Task updated successfully!" });
      setTimeout(() => setStatus({ type: "", message: "" }), 2000);
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Error updating task!" });
    }
  };

  const handleCheckboxChange = async (id, isDone) => {
    try {
      await axios.put(
        `${API_URL}/todo/${id}`,
        { done: !isDone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map((t) => (t._id === id ? { ...t, done: !isDone } : t)));
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Error updating task status!" });
    }
  };

  return (
    <div className="p-10 bg-black min-h-screen flex flex-col items-center">
      <div className="max-w-4xl w-full bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-4 text-center text-blue-600">To-Do List</h2>

        {status.message && (
          <p className={`text-center ${status.type === "error" ? "text-red-500" : "text-green-600"} font-semibold`}>
            {status.message}
          </p>
        )}

        {token ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Enter task title"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              placeholder="Enter task description"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Add Task
            </button>
          </form>
        ) : (
          <p className="text-red-500 text-center">Please log in to add tasks.</p>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map((task) => (
          <div key={task._id} className="bg-gray-200 p-6 rounded-lg shadow-md flex flex-col gap-4">
            <div>
              <input
                type="text"
                value={task.title}
                onChange={(e) => handleUpdate(task._id, e.target.value, task.body)}
                className="text-xl font-semibold w-full border-none bg-transparent focus:ring-0"
              />
              <textarea
                value={task.body}
                onChange={(e) => handleUpdate(task._id, task.title, e.target.value)}
                className="text-gray-600 w-full border-none bg-transparent focus:ring-0"
              />
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={() => handleDelete(task._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => handleCheckboxChange(task._id, task.done)}
                className="accent-blue-500 h-5 w-5 cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todos;

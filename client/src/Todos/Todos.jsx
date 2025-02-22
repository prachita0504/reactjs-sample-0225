import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Todos = () => {
  const [task, setTask] = useState("");
  const [body, setBody] = useState("");
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [token] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) fetchTodos();
  }, [token]);

  const fetchTodos = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching todos!");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim() || !body.trim()) {
      setError("All fields are required!");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/todos`,
        { title: task, body },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTask("");
      setBody("");
      setMessage("Task added successfully! ✅");
      fetchTodos();
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error adding task!");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Task deleted successfully!");
      fetchTodos();
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting task!");
      console.error(err);
    }
  };

  const handleUpdate = async (id) => {
    const newTitle = prompt("Enter new task title:");
    const newBody = prompt("Enter new task description:");
    if (!newTitle || !newBody) {
      setError("Both fields are required for updating!");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/todos/${id}`,
        { title: newTitle, body: newBody },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Task updated successfully!");
      fetchTodos();
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating task!");
      console.error(err);
    }
  };

  const handleCheckboxChange = async (id, isDone) => {
    try {
      await axios.put(
        `${API_URL}/todos/${id}`,
        { done: !isDone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTodos();
    } catch (err) {
      setError(err.response?.data?.message || "Error updating task status!");
      console.error(err);
    }
  };

  return (
    <div className="p-20 bg-black">
      <div className="max-w-4xl mx-auto mt-16 p-10 bg-gray-100 rounded-lg">
        <h2 className="text-4xl font-semibold mb-4 text-center text-blue-600">To-Do List</h2>

        {message && <p className="text-green-600 text-center font-semibold">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

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

      <div className="mt-6 flex flex-wrap justify-center gap-9">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-gray-200 p-6 rounded-lg shadow-md flex items-center justify-between w-[600px]"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-xl">{task.title}</h3>
              <p className="text-gray-600">{task.body}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleUpdate(task._id)}
                className="bg-yellow-500 text-white px-4 py-2 w-24 rounded-md hover:bg-yellow-600"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="bg-red-500 text-white px-4 py-2 w-24 rounded-md hover:bg-red-600"
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

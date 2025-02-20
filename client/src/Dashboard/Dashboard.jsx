import { useState, useEffect } from "react";

const Dashboard = () => {
  const [view, setView] = useState("todos");
  const [data, setData] = useState({ todos: [], books: [], stats: {} });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in.");
          return;
        }

        const response = await fetch("http://localhost:3000/dashboard", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-black min-h-screen">
      <div className="max-w-5xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-lg">
        
        <div className="flex justify-between items-center mb-10">
        
          <h1 className="text-5xl font-bold text-blue-300"> DASHBOARD</h1>
          
          <div>
            <button
              onClick={() => setView("todos")}
              className={`mr-2 px-4 py-2 rounded-lg transition-all ${
                view === "todos"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white"
              }`}
            >
              My Todos
            </button>
            <button
              onClick={() => setView("books")}
              className={`px-4 py-2 rounded-lg transition-all ${
                view === "books"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white"
              }`}
            >
              My Books
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-600 bg-red-100 p-3 rounded-lg mb-4 text-center">
            {error}
          </p>
        )}

        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-2xl shadow-md">
          <h2 className="text-lg font-bold text-gray-700">TRACK YOUR TODOS AND BOOKS</h2>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <p className="bg-blue-100 p-3 rounded-lg text-blue-800 shadow-sm">
              ✅ Total Todos: <strong>{data.stats.totalTodos || 0}</strong>
            </p>
            <p className="bg-green-100 p-3 rounded-lg text-green-800 shadow-sm">
              🎯 Completed Todos: <strong>{data.stats.completedTodos || 0}</strong>
            </p>
            <p className="bg-yellow-100 p-3 rounded-lg text-yellow-800 shadow-sm">
              ⏳ Remaining Todos: <strong>{data.stats.remainingTodos || 0}</strong>
            </p>
            <p className="bg-purple-100 p-3 rounded-lg text-purple-800 shadow-sm">
              📚 Total Books: <strong>{data.stats.totalBooks || 0}</strong>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {view === "todos" && data.todos.length > 0 ? (
            data.todos.map((todo, index) => (
              <div
                key={index}
                className="p-4 bg-white shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition-all"
              >
                <h2 className="text-lg font-semibold text-gray-800">{todo.title}</h2>
                <p className="text-gray-600">{todo.body}</p>
              </div>
            ))
          ) : view === "books" && data.books.length > 0 ? (
            data.books.map((book, index) => (
              <div
                key={index}
                className="p-4 bg-white shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition-all"
              >
                <h2 className="text-lg font-semibold text-gray-800">{book.bookName}</h2>
                <p className="text-gray-600">{book.description}</p>
                <p className="text-yellow-500 font-bold">⭐ Rating: {book.rating}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No items to display.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

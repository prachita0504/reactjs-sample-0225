import React, { useState, useEffect } from "react";
import axios from "axios";

const Books = () => {
  const [bookName, setBookName] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [token] = useState(localStorage.getItem("token"));

  useEffect(() => {
    fetchBooks();
  }, []);


  const fetchBooks = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await axios.get("https://taskm-2-l0zo.onrender.com/books", { headers });
      setBooks(data);
    } catch (err) {
      setError("Error fetching books!");
      console.error(err);
    }
  };

  // Add Book
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (bookName.trim() === "" || description.trim() === "" || rating === 0) {
      setError("All fields are required!");
      return;
    }

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.post(
        "https://taskm-2-l0zo.onrender.com/books",
        { bookName, description, rating },
        { headers }
      );
      setBookName("");
      setDescription("");
      setRating(0);
      setMessage("Book added successfully! ✅");
      fetchBooks();

      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setError("Error adding book!");
      console.error(err.response?.data || err.message);
    }
  };

  //deleting the book
  const handleDelete = async (id) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(`https://taskm-2-l0zo.onrender.com/books/${id}`, { headers });
      setMessage("Book deleted successfully! ✅");
      fetchBooks();

      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setError("Error deleting book!");
      console.error(err);
    }
  };

  // Update Book
  const handleUpdate = async (id) => {
    const newTitle = prompt("Enter new book title:");
    const newDescription = prompt("Enter new book description:");

    if (!newTitle || !newDescription) {
      setError("Both fields are required for updating!");
      return;
    }

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.put(
        `https://taskm-2-l0zo.onrender.com/books/${id}`,
        { bookName: newTitle, description: newDescription },
        { headers }
      );
      setMessage("Book updated successfully! ✅");
      fetchBooks();

      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setError("Error updating book!");
      console.error(err);
    }
  };

  return (
    <div className="p-20 bg-black">
      <div className="max-w-4xl mx-auto mt-16 p-10 bg-gray-100 rounded-lg">
        <h2 className="text-4xl font-semibold mb-4 text-center text-blue-600">Books List</h2>

        
        {message && <p className="text-green-600 text-center font-semibold">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}


        {token ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Enter book name"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              placeholder="Enter book description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Rate:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={`star-${star}`}
                  onClick={() => setRating(star)}
                  type="button"
                  className={`text-2xl ${star <= rating ? "text-yellow-500" : "text-gray-400"}`}
                >
                  ★
                </button>
              ))}
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Add Book
            </button>
          </form>
        ) : (
          <p className="text-red-500 text-center">Please log in to add books.</p>
        )}
      </div>


      <div className="mt-6 flex flex-wrap justify-center gap-9">
        {books.map((book) => (
          <div
            key={book._id}
            className="bg-gray-200 p-6 rounded-lg shadow-md flex items-center justify-between w-[600px]"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-xl">{book.bookName}</h3>
              <p className="text-gray-600">{book.description}</p>


              <div className="flex items-center gap-2 mt-2">
                <span className="text-gray-600">Rating:</span>
                {[...Array(book.rating)].map((_, index) => (
                  <span key={`${book._id}-star-${index}`} className="text-yellow-500 text-lg">
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleUpdate(book._id)}
                className="bg-yellow-500 text-white px-4 py-2 w-24 rounded-md hover:bg-yellow-600"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(book._id)}
                className="bg-red-500 text-white px-4 py-2 w-24 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;


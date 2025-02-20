require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const { z } = require("zod");
const Todo = require("./module/Todos");
const User = require("./module/User");
const Book = require("./module/Books");

const app = express();
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",  // Local development
  "https://task-all109e91-prachita-singhs-projects.vercel.app", // Vercel frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());


const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET not defined in environment variables.");
  process.exit(1);
}

//connect to mongodb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

// signup
app.post("/signup", async (req, res) => {
  const schema = z.object({
    email: z.string().email({ message: "Invalid email format" }),
    username: z.string().min(2).max(140),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(90)
      .refine((password) => /[A-Z]/.test(password), { message: "Password must contain at least one uppercase letter" })
      .refine((password) => /\d/.test(password), { message: "Password must contain at least one digit" }),
    confirmPassword: z.string().min(6).max(90),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });

  try {
    const { email, username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email: email.toLowerCase(),
      username,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "4h" });
    res.status(201).json({ message: "Registered successfully!", token });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// login 
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token, username: user.username });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied. Token required." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


app.post("/todo", auth, async (req, res) => {
  const schema = z.object({
    title: z.string().min(1).max(200),
    body: z.string().min(1).max(500),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });

  try {
    const todo = await Todo.create({
      title: req.body.title,
      body: req.body.body,
      done: false,
      userId: req.userId,
    });
    res.status(201).json(todo);
  } catch (error) {
    console.error("Todo Creation Error:", error);
    res.status(500).json({ message: "Failed to create todo" });
  }
});

app.get("/todos", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId });
    res.json(todos);
  } catch (error) {
    console.error("Fetch Todos Error:", error);
    res.status(500).json({ message: "Failed to fetch todos" });
  }
});


app.delete("/todos/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({ _id: id, userId: req.userId });

    if (!todo) return res.status(404).json({ message: "Todo not found" });

    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Todo Deletion Error:", error);
    res.status(500).json({ message: "Failed to delete todo" });
  }
});

app.put("/todos/:id", auth, async (req, res) => {
  try {
    const { title, body, done } = req.body;
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, body, done },
      { new: true }
    );

    if (!updatedTodo) return res.status(404).json({ message: "Todo not found" });
    res.json(updatedTodo);
  } catch (error) {
    console.error("Todo Update Error:", error);
    res.status(500).json({ message: "Failed to update todo" });
  }
});



//book
app.post("/books", auth, async (req, res) => {
  const schema = z.object({
    bookName: z.string().min(1).max(200),
    description: z.string().min(1).max(500),
    rating: z.number().min(1).max(5),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });

  try {
    const book = await Book.create({
      bookName: req.body.bookName,
      description: req.body.description,
      rating: req.body.rating,
      userId: req.userId,
    });

    res.status(201).json(book);
  } catch (error) {
    console.error("Book Creation Error:", error);
    res.status(500).json({ message: "Failed to create book" });
  }
});


app.get("/books", auth, async (req, res) => {
  try {
    const books = await Book.find({ userId: req.userId });
    res.json(books);
  } catch (error) {
    console.error("Fetch Books Error:", error);
    res.status(500).json({ message: "Failed to fetch books" });
  }
});


app.delete("/books/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findOneAndDelete({ _id: id, userId: req.userId });

    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Book Deletion Error:", error);
    res.status(500).json({ message: "Failed to delete book" });
  }
});


app.put("/books/:id", auth, async (req, res) => {
  try {
    const { bookName, description } = req.body;
    const updatedBook = await Book.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { bookName, description },
      { new: true }
    );

    if (!updatedBook) return res.status(404).json({ message: "Book not found" });
    res.json(updatedBook);
  } catch (error) {
    console.error("Book Update Error:", error);
    res.status(500).json({ message: "Failed to update book" });
  }
});

//dashboard
app.get("/dashboard", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId });
    const books = await Book.find({ userId: req.userId });
    const stats = {
      totalTodos: todos.length,
      completedTodos: todos.filter(todo => todo.done).length,
      remainingTodos: todos.filter(todo => !todo.done).length,
      totalBooks: books.length
    };

    res.json({ todos, books, stats });
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch your data" });
  }
});



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(` Server running on port ${port}`));

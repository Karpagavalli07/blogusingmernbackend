const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog");
const userRoutes = require("./routes/user");
const connectDB = require("./config/db");

const app = express();
const path = require("path");

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: `${process.env.ALLOWED_FRONT_URL}`,  // your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", authRoutes);          // auth routes → /api/register, /api/login
app.use("/api/user", userRoutes)
app.use("/api/blogs", blogRoutes);    // blog routes → /api/blogs

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("❌ Server startup failed:", err));

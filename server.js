const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog"); // ✅ import blog routes

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", authRoutes);          // auth routes → /api/register, /api/login
app.use("/api/blogs", blogRoutes);    // blog routes → /api/blogs

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(5000, () =>
      console.log("🚀 Server running on http://localhost:5000")
    );
  })
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

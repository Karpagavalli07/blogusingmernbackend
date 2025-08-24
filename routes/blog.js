const express = require("express");
const Blog = require("../models/Blog");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Middleware to check auth
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Create blog
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, snippet, description } = req.body;
    const blog = new Blog({
      title,
      snippet,
      description,
      user: req.user,
    });
    await blog.save();
    res.json({ message: "Blog created successfully", blog });
  } catch (err) {
    res.status(500).json({ message: "Error creating blog", error: err.message });
  }
});

module.exports = router;

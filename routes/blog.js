// routes/blogRoutes.js
const express = require("express");
const Blog = require("../models/Blog");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create Blog
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, snippet, description } = req.body;
    const blog = await Blog.create({
      title,
      snippet,
      description,
      author: req.user.id
    });
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Blogs (latest first)
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "username email profilePic")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Blogs by Author
router.get("/author/:authorId", async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.authorId })
      .populate("author", "username email profilePic")
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Blog
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "username email"
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Blog (only author)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, snippet, description } = req.body;
    blog.title = title || blog.title;
    blog.snippet = snippet || blog.snippet;
    blog.description = description || blog.description;
    await blog.save();

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Blog (only author)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    console.log("Delete request for blog ID:", req.params.id);
    console.log("User ID from token:", req.user.id);
    
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    console.log("Blog author ID:", blog.author.toString());
    console.log("Comparing:", blog.author.toString(), "with", req.user.id);

    if (blog.author.toString() !== req.user.id) {
      console.log("Authorization failed");
      return res.status(403).json({ message: "Not authorized" });
    }

    console.log("Authorization successful, deleting blog...");
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Like/Unlike Blog
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const userId = req.user.id;
    if (blog.likes.includes(userId)) {
      // Unlike
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like
      blog.likes.push(userId);
    }
    await blog.save();

    res.json({ likes: blog.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

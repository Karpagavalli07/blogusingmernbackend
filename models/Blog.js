// models/Blog.js
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    snippet: { type: String, required: true }, // previously 'content'
    description: { type: String }, // previously 'category'
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // users who liked
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);

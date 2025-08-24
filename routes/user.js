const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const upload = require("../middleware/upload");

router.get("/getUser", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/profile", authMiddleware, upload.single("profilePic"), async (req, res) => {
  try {
    const { username, email } = req.body;

    const updateData = { username, email };
    if (req.file) {
      updateData.profilePic = `uploads/${req.file.filename}`; // relative path
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

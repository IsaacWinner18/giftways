const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const hashed = await bcrypt.hash(password, 10);
    // Only save name, email, and password at registration
    const user = new User({ name, email, password: hashed });
    await user.save();
    res.status(201).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Middleware to verify JWT
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Get current user's profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update profile (name, bank/account details, phone)
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, bankName, accountNumber, accountName, phoneNumber } =
      req.body;
    // Backend validation: all fields required
    if (!name || !bankName || !accountNumber || !accountName || !phoneNumber) {
      return res
        .status(400)
        .json({ error: "All profile fields are required." });
    }
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.name = name;
    user.bankName = bankName;
    user.accountNumber = accountNumber;
    user.accountName = accountName;
    user.phoneNumber = phoneNumber;
    user.updatedAt = new Date();
    await user.save();
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bankName: user.bankName,
        accountNumber: user.accountNumber,
        accountName: user.accountName,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Password reset (user must be logged in, provide old and new password)
router.post("/reset-password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(400).json({ error: "Old and new password required" });
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match)
      return res.status(400).json({ error: "Old password incorrect" });
    user.password = await bcrypt.hash(newPassword, 10);
    user.updatedAt = new Date();
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Admin middleware
function admin(req, res, next) {
  User.findById(req.userId).then((user) => {
    if (user && user.isAdmin) return next();
    return res.status(403).json({ error: "Admin only" });
  });
}

// Admin: Get all users
router.get("/all", auth, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: Delete user by ID
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Forgot password - request reset
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "No user with that email" });
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour
    await user.save();
    // In real app, email token to user. Here, return for testing.
    res.json({ success: true, resetToken: token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Reset password with token
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    if (!newPassword)
      return res.status(400).json({ error: "New password required" });
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ error: "Invalid or expired token" });
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.updatedAt = new Date();
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

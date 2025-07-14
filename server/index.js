require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// CORS must be set before any routes
app.use(
  cors({
    origin: process.env.CORS_URI || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.send("API is running");
});

// API routes (always use /api/* from frontend)
app.use("/api/campaigns", require("./routes/campaigns"));
app.use("/api/users", require("./routes/users"));
app.use("/api/analytics", require("./routes/analytics"));

// Remove non-API prefixed routes to avoid confusion
// app.use("/campaigns", require("./routes/campaigns"));
// app.use("/users", require("./routes/users"));
// app.use("/analytics", require("./routes/analytics"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  mongoose.connect(process.env.MONGODB_URI);
  console.log(`Server running on port ${PORT}`);
});

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: process.env.CORS_URI,
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/campaigns", require("./routes/campaigns"));
app.use("/api/users", require("./routes/users"));
app.use("/api/analytics", require("./routes/analytics"));

// Add non-API prefixed routes for direct access
app.use("/campaigns", require("./routes/campaigns"));
app.use("/users", require("./routes/users"));
app.use("/analytics", require("./routes/analytics"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  mongoose.connect(process.env.MONGODB_URI);
  console.log(`Server running on port ${PORT}`);
});

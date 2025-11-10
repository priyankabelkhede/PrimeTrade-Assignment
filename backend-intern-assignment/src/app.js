const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks"); // Make sure this line exists

const app = express();

// Basic Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/intern_assignment"
  )
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes); // Make sure this line exists

// Basic Test Route
app.get("/api/v1/test", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Backend Server is Running!",
    timestamp: new Date().toISOString(),
  });
});

// Health Check Route
app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Test URL: http://localhost:${PORT}/api/v1/test`);
  console.log(`🔐 Auth routes: http://localhost:${PORT}/api/v1/auth`);
  console.log(`📝 Task routes: http://localhost:${PORT}/api/v1/tasks`);
});

// index.js
// ===============================
// 📘 Tejas Habit Tracker Backend
// Express + MongoDB Setup
// ===============================

// 1️⃣ Import required modules
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const habitRoutes = require("./routes/habitRoutes");



// 2️⃣ Initialize Express app
const app = express();

// 3️⃣ Middleware setup
app.use(cors()); // Allow frontend to access API
app.use(express.json()); // Parse JSON requests
app.use("/api/users", userRoutes);
app.use("/api/habits", habitRoutes);


// 4️⃣ Connect to MongoDB
connectDB();

// 5️⃣ Test route to verify server is running
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Tejas Habit Tracker API is running successfully!",
    status: "OK",
  });
});

// 6️⃣ Health check route to verify DB connection status
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ["Disconnected", "Connected", "Connecting", "Disconnecting"];
  res.json({
    success: true,
    server: "Running",
    database: states[dbState],
  });
});



// Test: create dummy user (for testing database)
const User = require("./models/user");

app.get("/api/test-create-user", async (req, res) => {
  try {
    const newUser = new User({
      name: "Tejas Deshmukh",
      email: "tejas@example.com",
      password: "123456",
    });

    await newUser.save();
    res.json({ success: true, message: "User created!", user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 7️⃣ Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

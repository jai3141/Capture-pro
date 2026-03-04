// Import required packages
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const bookingRoutes = require("./routes/bookingRoutes");

connectDB(); // This connects MongoDB

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//Routes

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/booking", require("./routes/bookingRoutes"));
app.use("/api/gallery", require("./routes/galleryRoutes"));

// Simple test route
app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
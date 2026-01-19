const express = require("express");
const connectDB = require("./db");
const User = require("./user.model");

const app = express();

// Middleware
app.use(express.json());

// Connect MongoDB
connectDB();

/**
 * REGISTER
 * POST /users/register
 * body: { name, email, password }
 */
app.post("/users/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create user
    await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * LOGIN
 * POST /users/login
 * body: { email, password }
 */
app.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(3000, () => {
  console.log("✅ Server running on port 3000");
});

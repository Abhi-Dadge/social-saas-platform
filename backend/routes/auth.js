const express = require("express");
const router = express.Router();
const db = require("../database/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = "secret123";

// ✅ Register
router.post("/register", async (req, res) => {
  try {
    console.log("REGISTER HIT:", req.body); // 🔥 debug

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const existingUser = db.prepare(`
      SELECT * FROM users WHERE email = ?
    `).get(email);

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const result = db.prepare(`
      INSERT INTO users (email, password)
      VALUES (?, ?)
    `).run(email, hash);

    res.json({
      message: "Registered successfully",
      userId: result.lastInsertRowid
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ Login
router.post("/login", async (req, res) => {
  try {
    console.log("LOGIN HIT:", req.body); // 🔥 debug

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = db.prepare(`
      SELECT * FROM users WHERE email = ?
    `).get(email);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: "Wrong password" });
    }

    const token = jwt.sign({ email }, SECRET, { expiresIn: "1d" });

    res.json({ token });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
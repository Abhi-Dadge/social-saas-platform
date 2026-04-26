const express = require("express");
const cors = require("cors");

const db = require("./database/db");

const app = express();

// ✅ Middlewares
app.use(cors({
  origin: "*", // allow all (later restrict)
}));
app.use(express.json());

// ✅ Routes
app.get("/", (req, res) => {
  res.send("Server Running");
});

const postRoutes = require("./routes/posts");
app.use("/posts", postRoutes);

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// ✅ Start server (ALWAYS LAST)
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
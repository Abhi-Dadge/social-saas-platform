const express = require("express");
const cors = require("cors");

const db = require("./database/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server Running");
});

const postRoutes = require("./routes/posts");
app.use("/posts", postRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

 

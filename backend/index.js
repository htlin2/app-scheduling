const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./db");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

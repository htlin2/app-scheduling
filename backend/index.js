const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./db");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

app.get("/doctors", async (req, res) => {
  const query = await pool.query("SELECT * FROM doctors ORDER BY id");
  res.json(query.rows);
});

app.get("/appointments", async (req, res) => {
  const query = await pool.query(`
      SELECT * from appointments
      JOIN patients ON appointments."patientId" = patients.id
      JOIN doctors ON appointments."doctorId" = doctors.id
      ORDER BY appointments.id
    `);
  res.json(query.rows);
});

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

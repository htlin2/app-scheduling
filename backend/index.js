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
  const { doctorId } = req.query;
  if (!doctorId) throw Error("Require doctorId");
  const query = await pool.query(`
      SELECT 
        appointments.*,
        patients."firstName" AS "patientFirstName",
        patients."lastName" AS "patientLastName",
        doctors."firstName" AS "doctorFirstName",
        doctors."lastName" AS "doctorLastName",
        doctors."email" AS "doctorEmail"
      FROM appointments
      JOIN patients ON appointments."patientId" = patients.id
      JOIN doctors ON appointments."doctorId" = doctors.id
      WHERE doctors.id = ${doctorId}
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

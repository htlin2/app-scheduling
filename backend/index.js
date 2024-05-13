const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./models/db");
const db = require("./models");
const { error } = require("console");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

app.get("/doctors", async (req, res) => {
  const doctors = await db.getDoctors();
  res.json(doctors);
});

app.get("/appointments", async (req, res) => {
  const { doctorId } = req.query;
  if (!doctorId) {
    return res.status(400).json({ error: "DoctorId Required" });
  }
  const appointments = await db.getAppointmentsByDoctorId(doctorId);
  res.json(appointments);
});

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

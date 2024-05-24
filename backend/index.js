const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./models");
const PORT = process.env.PORT || 3000;
const dayjs = require("dayjs");

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

app.get("/appointments/:appointmentId", async (req, res) => {
  const { appointmentId } = req.params;
  if (!appointmentId) {
    return res.status(400).json({ error: "appointmentId Required" });
  }
  const [appointment] = await db.getAppointmentById(appointmentId);
  res.json(appointment);
});

app.delete("/appointments/:appointmentId", async (req, res) => {
  const { appointmentId } = req.params;
  if (!appointmentId) {
    return res.status(400).json({ error: "AppointmentId Required" });
  }
  const appointments = await db.deleteAppointmentById(appointmentId);
  res.json(appointments);
});

app.post("/appointments", async (req, res) => {
  const body = {
    doctorId: req.body.doctorId,
    patientFirstName: req.body.patientFirstName,
    patientLastName: req.body.patientLastName,
    time: req.body.time,
    kind: req.body.kind,
  };
  const isValid = await validateAppointment(body);
  if (!isValid) {
    console.error("Appointment message body not valid");
    return res
      .status(400)
      .json({ error: "Appointment message body not valid" });
  }
  const appointment = await db.addAppointment(body);
  res.json(appointment);
});

app.put("/appointments/:appointmentId", async (req, res) => {
  const body = {
    doctorId: req.body.doctorId,
    patientFirstName: req.body.patientFirstName,
    patientLastName: req.body.patientLastName,
    time: req.body.time,
    kind: req.body.kind,
    appointmentId: req.params.appointmentId,
  };
  const isValid = await validateAppointment(body);
  if (!isValid) {
    console.error("Appointment message body not valid");
    return res
      .status(400)
      .json({ error: "Appointment message body not valid" });
  }
  const appointment = await db.updateAppointment(body);
  res.json(appointment);
});

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

async function validateAppointment({ doctorId, time }) {
  if (!doctorId) return false;
  const minutes = dayjs(time).minute();
  if (minutes % 15 !== 0) return false;
  const appointments = await db.getAppointmentsByDoctorId(doctorId);
  const sameTimeAppointments = appointments.filter((a) => {
    return dayjs(a.time).isSame(time);
  });
  if (sameTimeAppointments.length >= 3) return false;
  return true;
}

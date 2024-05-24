const pool = require("./db");

async function getDoctors() {
  const query = await pool.query("SELECT * FROM doctors ORDER BY id");
  return query.rows;
}

async function getAppointmentsByDoctorId(doctorId) {
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
  return query.rows;
}

async function getAppointmentById(appointmentId) {
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
      WHERE appointments.id = ${appointmentId}
      ORDER BY appointments.id
    `);
  return query.rows;
}

async function deleteAppointmentById(appointmentId) {
  const query = await pool.query(
    `DELETE FROM appointments WHERE id = ${appointmentId}`,
  );
  return query.rows;
}

async function addAppointment({
  doctorId,
  patientFirstName,
  patientLastName,
  time,
  kind,
}) {
  try {
    const patientQuery = await pool.query(
      `INSERT INTO patients ("firstName", "lastName") 
      VALUES ($1, $2)
      RETURNING *`,
      [patientFirstName, patientLastName],
    );
    const [patient] = patientQuery.rows;
    const appointmentQuery = await pool.query(
      `INSERT INTO appointments ("patientId", "doctorId", "time", "kind")
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [patient.id, doctorId, time, kind],
    );
    const [appointment] = appointmentQuery.rows;
    return appointment;
  } catch (error) {
    console.log(error);
  }
}

async function updateAppointment({
  appointmentId,
  patientFirstName,
  patientLastName,
  time,
  kind,
}) {
  try {
    const appointmentQuery = await pool.query(
      `UPDATE appointments
      SET "time" = $1, "kind" = $2
      WHERE id = $3
      RETURNING *`,
      [time, kind, appointmentId],
    );
    const [appointment] = appointmentQuery.rows;
    await pool.query(
      `UPDATE patients
      SET "firstName" = $1, "lastName" = $2
      WHERE id = $3
      RETURNING *`,
      [patientFirstName, patientLastName, appointment.patientId],
    );
    return appointment;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getDoctors,
  getAppointmentsByDoctorId,
  getAppointmentById,
  deleteAppointmentById,
  addAppointment,
  updateAppointment,
};

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

module.exports = {
  getDoctors,
  getAppointmentsByDoctorId,
};

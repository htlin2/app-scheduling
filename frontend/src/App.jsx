import { useState, useEffect, useCallback } from "react";
import { Row, Col, Container } from "react-bootstrap";
import Appointments from "./Appointments";
import Sidebar from "./Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import dayjs from "dayjs";

function App() {
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState({});
  const [appointments, setAppointments] = useState([]);
  const getDoctors = async () => {
    try {
      const url = new URL("http://localhost:3000/doctors");
      const res = await fetch(url);
      return res.json();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const getAppointmentsByDoctorId = async (doctorId) => {
    try {
      const url = new URL("http://localhost:3000/appointments");
      url.searchParams.append("doctorId", doctorId);
      const res = await fetch(url);
      return res.json();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const deleteAppointmentByAppointmentId = async (appointmentId) => {
    try {
      const url = new URL(
        `http://localhost:3000/appointments/${appointmentId}`,
      );
      const options = { method: "DELETE" };
      const res = await fetch(url, options);
      return res.json();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleSelectDoctor = async (doctorId) => {
    if (!doctorId) return null;
    const [doctor] = doctors.filter((d) => d.id === doctorId);
    if (!doctor) return null;
    const appointmentRows = await getAppointmentsByDoctorId(doctor.id);
    setDoctor(doctor);
    setAppointments(appointmentRows);
  };
  const handleDelete = async ({ appointmentId, doctorId }) => {
    await deleteAppointmentByAppointmentId(appointmentId);
    await handleSelectDoctor(doctorId);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { patientFirstName, patientLastName, time, kind } =
      Object.fromEntries(formData);
    const formattedTime = dayjs(`2024-04-13 ${time}`);
    const url = new URL(`http://localhost:3000/appointments/`);
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientFirstName,
        patientLastName,
        time: formattedTime,
        kind,
        doctorId: doctor.id,
      }),
    };
    await fetch(url, options);
    await handleSelectDoctor(doctor.id);
  };
  const initalLoad = useCallback(async () => {
    const doctorRows = await getDoctors();
    const [doctorRow] = doctorRows;
    if (!doctorRow) return null;
    const appointmentRows = await getAppointmentsByDoctorId(doctorRow.id);
    setDoctor(doctorRow);
    setDoctors(doctorRows);
    setAppointments(appointmentRows);
  }, []);
  useEffect(() => {
    initalLoad();
  }, [initalLoad]);
  return (
    <Container className="m-4">
      <Row>
        <Col md="3" className="sidebar">
          <Sidebar
            doctors={doctors}
            selectedDoctorId={doctor.id}
            handleSelectDoctor={handleSelectDoctor}
          />
        </Col>
        <Col>
          <Appointments
            appointments={appointments}
            doctor={doctor}
            handleDelete={handleDelete}
            handleSubmit={handleSubmit}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default App;

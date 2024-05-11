import { useState, useEffect } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Appointments from "./Appointments";
import Sidebar from "./Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState({});
  const [appointments, setAppointments] = useState([]);
  const getDoctors = async () => {
    try {
      const res = await fetch("http://localhost:3000/doctors");
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const getAppointmentsByDoctorId = async (params) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const fetchUrl = `http://localhost:3000/appointments?${queryString}`;
      const res = await fetch(fetchUrl);
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleSelectDoctor = async (doctorId) => {
    if (!doctorId) return null;
    const [doctor] = doctors.filter((d) => d.id === doctorId);
    if (!doctor) return null;
    const appointmentRows = await getAppointmentsByDoctorId({
      doctorId: doctor.id,
    });
    setDoctor(doctor);
    setAppointments(appointmentRows);
  };
  const initalLoad = async () => {
    const doctorRows = await getDoctors();
    const [doctorRow] = doctorRows;
    if (!doctorRow) return null;
    const appointmentRows = await getAppointmentsByDoctorId({
      doctorId: doctorRow.id,
    });
    setDoctor(doctorRow);
    setDoctors(doctorRows);
    setAppointments(appointmentRows);
  };
  useEffect(() => {
    initalLoad();
  }, []);
  return (
    <Container className="m-4">
      <Row>
        <Col md className="sidebar">
          <Sidebar
            doctors={doctors}
            selectedDoctorId={doctor.id}
            handleSelectDoctor={handleSelectDoctor}
          />
        </Col>
        <Col lg>
          <Appointments appointments={appointments} doctor={doctor} />
        </Col>
      </Row>
    </Container>
  );
}

export default App;

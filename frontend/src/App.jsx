import { useState, useEffect, useCallback } from "react";
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
      const url = new URL("http://localhost:3000/doctors");
      const res = await fetch(url);
      if (!res.ok) throw new Error("Network response was not ok");
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
    const appointmentRows = await getAppointmentsByDoctorId(doctor.id);
    setDoctor(doctor);
    setAppointments(appointmentRows);
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
          <Appointments appointments={appointments} doctor={doctor} />
        </Col>
      </Row>
    </Container>
  );
}

export default App;

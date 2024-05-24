import { useEffect, useState, useCallback } from "react";
import { Col, Row, Form, Button, Table, Modal } from "react-bootstrap";
import dayjs from "dayjs";

function Appointments(props) {
  const {
    appointments,
    doctor,
    handleDelete,
    handleSubmit,
    handleSelectDoctor,
  } = props;
  const [show, setShow] = useState(false);
  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);
  const doctorFullName = `Dr. ${doctor.firstName} ${doctor.lastName}`;
  return (
    <>
      <h1>{doctorFullName}</h1>
      <h5>{doctor.email}</h5>
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Time</th>
            <th>Kind</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, i) => {
            const { patientFirstName, patientLastName, time, kind } =
              appointment;
            const formattedTime = dayjs(time).format("hh:mm a");
            const fullName = `${patientFirstName} ${patientLastName}`;
            return (
              <tr key={i}>
                <EditModal
                  handleSelectDoctor={handleSelectDoctor}
                  show={show}
                  handleClose={handleClose}
                  appointmentId={appointment.id}
                />
                <td width="5%">{i + 1}</td>
                <td width="55%">{fullName}</td>
                <td width="20%">{formattedTime}</td>
                <td width="20%">{kind}</td>
                <td>
                  <Button onClick={handleOpen}>Edit</Button>
                </td>
                <td>
                  <Button
                    onClick={async () =>
                      await handleDelete({
                        doctorId: doctor.id,
                        appointmentId: appointment.id,
                      })
                    }
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Control
              type="text"
              name="patientFirstName"
              placeholder="patient first name"
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              name="patientLastName"
              placeholder="patient last name"
            />
          </Col>
          <Col>
            <Form.Control name="time" type="time" placeholder="time" />
          </Col>
          <Col>
            <Form.Control name="kind" type="text" placeholder="kind" />
          </Col>
          <Col>
            <Button type="submit">Submit</Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}

function EditModal(props) {
  const { show, handleClose, appointmentId, handleSelectDoctor } = props;
  const [appointment, setAppointment] = useState({});
  const handleSubmit = async () => {
    const url = new URL(`http://localhost:3000/appointments/${appointmentId}`);
    const options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...appointment }),
    };
    await fetch(url, options);
    await handleSelectDoctor(appointment.doctorId);
    handleClose();
  };
  const getAppointmentById = useCallback(async () => {
    const url = new URL(`http://localhost:3000/appointments/${appointmentId}`);
    const res = await fetch(url);
    const appointmentRow = await res.json();
    if (!appointmentRow) return null;
    setAppointment(appointmentRow);
  }, [appointmentId]);
  useEffect(() => {
    getAppointmentById();
  }, [getAppointmentById]);
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <label>patientFirstName</label>
            <input
              value={appointment.patientFirstName}
              onChange={(e) => {
                setAppointment((prev) => ({
                  ...prev,
                  patientFirstName: e.target.value,
                }));
              }}
            />
          </Row>
          <Row>
            <label>patientLastName</label>
            <input
              value={appointment.patientLastName}
              onChange={(e) => {
                setAppointment((prev) => ({
                  ...prev,
                  patientLastName: e.target.value,
                }));
              }}
            />
          </Row>
          <Row>
            <label>time</label>
            <input
              value={appointment.time}
              onChange={(e) => {
                setAppointment((prev) => ({
                  ...prev,
                  time: e.target.value,
                }));
              }}
            />
          </Row>
          <Row>
            <label>kind</label>
            <input
              value={appointment.kind}
              onChange={(e) => {
                setAppointment((prev) => ({
                  ...prev,
                  kind: e.target.value,
                }));
              }}
            />
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Appointments;

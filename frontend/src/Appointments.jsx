import { Col, Row, Form, Button, Table } from "react-bootstrap";
import dayjs from "dayjs";

function Appointments({ appointments, doctor, handleDelete, handleSubmit }) {
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
            <th>Action</th>
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
                <td width="5%">{i + 1}</td>
                <td width="55%">{fullName}</td>
                <td width="20%">{formattedTime}</td>
                <td width="20%">{kind}</td>
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

export default Appointments;

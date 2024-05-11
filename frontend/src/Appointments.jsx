import Table from "react-bootstrap/Table";

function Appointments({ appointments, doctor }) {
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
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, i) => {
            const { patientFirstName, patientLastName, time, kind } =
              appointment;
            const fullName = `${patientFirstName} ${patientLastName}`;
            return (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{fullName}</td>
                <td>{time}</td>
                <td>{kind}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}

export default Appointments;

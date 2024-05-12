import Table from "react-bootstrap/Table";
import moment from "moment";

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
            const formattedTime = moment(time).format("hh:mm a");
            const fullName = `${patientFirstName} ${patientLastName}`;
            return (
              <tr key={i}>
                <td width="5%">{i + 1}</td>
                <td width="55%">{fullName}</td>
                <td width="20%">{formattedTime}</td>
                <td width="20%">{kind}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}

export default Appointments;

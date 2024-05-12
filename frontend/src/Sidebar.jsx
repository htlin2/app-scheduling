function Sidebar({ doctors, selectedDoctorId, handleSelectDoctor }) {
  return (
    <>
      <h4>PHYSICIANS</h4>
      {doctors.map((doctor) => {
        const fullName = `${doctor.firstName} ${doctor.lastName}`;
        const isSelected = doctor.id === selectedDoctorId;
        const cssStyle = isSelected ? "selected" : "not-selected";
        return (
          <div
            style={{ cursor: "pointer" }}
            className={cssStyle}
            key={doctor.id}
            onClick={async () => await handleSelectDoctor(doctor.id)}
          >
            &#x2022; {fullName}
          </div>
        );
      })}
    </>
  );
}

export default Sidebar;

function validateAppointmentDateTime(value) {
  const appointmentDate = new Date(value);

  if (Number.isNaN(appointmentDate.getTime())) {
    return {
      valid: false,
      message: "Invalid appointment date and time",
    };
  }

  if (appointmentDate <= new Date()) {
    return {
      valid: false,
      message: "Appointment must be scheduled in the future",
    };
  }

  const hours = appointmentDate.getHours();
  const minutes = appointmentDate.getMinutes();
  const seconds = appointmentDate.getSeconds();

  if (hours < 9 || hours > 17) {
    return {
      valid: false,
      message: "Appointments must be between 09:00 and 17:00",
    };
  }

  if (hours === 17 && minutes !== 0) {
    return {
      valid: false,
      message: "The latest available appointment time is 17:00",
    };
  }

  if (![0, 30].includes(minutes) || seconds !== 0) {
    return {
      valid: false,
      message: "Appointments must start on a 30-minute boundary",
    };
  }

  return {
    valid: true,
    appointmentDate,
  };
}

module.exports = {
  validateAppointmentDateTime,
};

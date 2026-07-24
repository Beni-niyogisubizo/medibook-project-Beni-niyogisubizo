const appointmentModel = require("../models/appointmentModel");
const {
  validateAppointmentDateTime,
} = require("../utils/appointmentValidation");

function isValidId(value) {
  return Number.isInteger(Number(value)) && Number(value) > 0;
}

async function createAppointment(req, res) {
  try {
    const {
      patientId,
      doctorId,
      appointmentDatetime,
      amountPaid,
    } = req.body;

    if (
      patientId === undefined ||
      doctorId === undefined ||
      !appointmentDatetime ||
      amountPaid === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Patient ID, doctor ID, appointment time, and amount paid are required",
      });
    }

    if (!isValidId(patientId) || !isValidId(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Patient ID and doctor ID must be valid positive integers",
      });
    }

    if (
      !Number.isFinite(Number(amountPaid)) ||
      Number(amountPaid) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Amount paid must be a valid non-negative number",
      });
    }

    const validation = validateAppointmentDateTime(
      appointmentDatetime
    );

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const appointment = await appointmentModel.createAppointment({
      patientId: Number(patientId),
      doctorId: Number(doctorId),
      appointmentDatetime,
      amountPaid: Number(amountPaid),
    });

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "This doctor and time slot are already booked",
      });
    }

    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create appointment error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to book appointment",
    });
  }
}

async function getAllAppointments(req, res) {
  try {
    const appointments =
      await appointmentModel.findAllAppointments();

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("Get appointments error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve appointments",
    });
  }
}

async function getAppointmentById(req, res) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
    }

    const appointment =
      await appointmentModel.findAppointmentById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Get appointment error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve appointment",
    });
  }
}

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
};

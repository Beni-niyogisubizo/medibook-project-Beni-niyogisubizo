const patientModel = require("../models/patientModel");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidId(id) {
  return Number.isInteger(Number(id)) && Number(id) > 0;
}

async function createPatient(req, res) {
  try {
    const { fullName, email, phone } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({
        success: false,
        message: "Full name and email are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "A valid email address is required",
      });
    }

    const patient = await patientModel.createPatient({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Patient created successfully",
      data: patient,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A patient with this email already exists",
      });
    }

    console.error("Create patient error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create patient",
    });
  }
}

async function getAllPatients(req, res) {
  try {
    const patients = await patientModel.findAllPatients();

    return res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    console.error("Get patients error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve patients",
    });
  }
}

async function getPatientById(req, res) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    const patient = await patientModel.findPatientById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.error("Get patient error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve patient",
    });
  }
}

async function updatePatient(req, res) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    const { fullName, email, phone } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({
        success: false,
        message: "Full name and email are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "A valid email address is required",
      });
    }

    const patient = await patientModel.updatePatient(req.params.id, {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim(),
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A patient with this email already exists",
      });
    }

    console.error("Update patient error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update patient",
    });
  }
}

async function deletePatient(req, res) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    const deleted = await patientModel.deletePatient(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        success: false,
        message: "Patient cannot be deleted because they have appointments",
      });
    }

    console.error("Delete patient error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to delete patient",
    });
  }
}

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};

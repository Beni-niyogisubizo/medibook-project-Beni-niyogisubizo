const doctorModel = require("../models/doctorModel");

function isValidId(id) {
  return Number.isInteger(Number(id)) && Number(id) > 0;
}

function isValidFee(value) {
  return Number.isFinite(Number(value)) && Number(value) >= 0;
}

async function createDoctor(req, res) {
  try {
    const {
      fullName,
      specialty,
      consultationFee,
      roomNumber,
    } = req.body;

    if (!fullName || !specialty || consultationFee === undefined) {
      return res.status(400).json({
        success: false,
        message:
          "Full name, specialty, and consultation fee are required",
      });
    }

    if (!isValidFee(consultationFee)) {
      return res.status(400).json({
        success: false,
        message: "Consultation fee must be a valid non-negative number",
      });
    }

    const doctor = await doctorModel.createDoctor({
      fullName: fullName.trim(),
      specialty: specialty.trim(),
      consultationFee: Number(consultationFee),
      roomNumber: roomNumber?.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: doctor,
    });
  } catch (error) {
    console.error("Create doctor error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create doctor",
    });
  }
}

async function getAllDoctors(req, res) {
  try {
    const doctors = await doctorModel.findAllDoctors();

    return res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error("Get doctors error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve doctors",
    });
  }
}

async function getDoctorById(req, res) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    const doctor = await doctorModel.findDoctorById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error("Get doctor error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve doctor",
    });
  }
}

async function updateDoctor(req, res) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    const {
      fullName,
      specialty,
      consultationFee,
      roomNumber,
    } = req.body;

    if (!fullName || !specialty || consultationFee === undefined) {
      return res.status(400).json({
        success: false,
        message:
          "Full name, specialty, and consultation fee are required",
      });
    }

    if (!isValidFee(consultationFee)) {
      return res.status(400).json({
        success: false,
        message: "Consultation fee must be a valid non-negative number",
      });
    }

    const doctor = await doctorModel.updateDoctor(req.params.id, {
      fullName: fullName.trim(),
      specialty: specialty.trim(),
      consultationFee: Number(consultationFee),
      roomNumber: roomNumber?.trim(),
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.error("Update doctor error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update doctor",
    });
  }
}

async function deleteDoctor(req, res) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    const deleted = await doctorModel.deleteDoctor(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        success: false,
        message: "Doctor cannot be deleted because they have appointments",
      });
    }

    console.error("Delete doctor error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to delete doctor",
    });
  }
}

module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};

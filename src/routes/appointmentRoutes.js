const express = require("express");
const appointmentController = require(
  "../controllers/appointmentController"
);

const router = express.Router();

router.post("/", appointmentController.createAppointment);
router.get("/", appointmentController.getAllAppointments);
router.get("/:id", appointmentController.getAppointmentById);

module.exports = router;

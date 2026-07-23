const express = require("express");
const doctorController = require("../controllers/doctorController");

const router = express.Router();

router.post("/", doctorController.createDoctor);
router.get("/", doctorController.getAllDoctors);
router.get("/:id", doctorController.getDoctorById);
router.put("/:id", doctorController.updateDoctor);
router.delete("/:id", doctorController.deleteDoctor);

module.exports = router;

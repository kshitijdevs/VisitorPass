const express = require("express");

const {
    createAppointment,
    getAppointments,
    updateAppointmentStatus
} = require("../controllers/appointmentController");

const router = express.Router();

router.get("/", getAppointments);

router.post("/", createAppointment);

router.patch("/:id/status", updateAppointmentStatus);

module.exports = router;
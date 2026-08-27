const express = require("express");

const {
    createAppointment,
    getAppointments,
    updateAppointmentStatus
} = require("../controllers/appointmentController");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getAppointments);

router.post("/", authorize("admin", "employee"), createAppointment);

router.patch("/:id/status", authorize("admin", "employee"), updateAppointmentStatus);

module.exports = router;

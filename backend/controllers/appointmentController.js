const Appointment = require("../models/Appointment");
const { sendAppointmentEmail } = require("../utils/email");

const createAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.create(req.body);

        res.status(201).json(appointment);

    } catch (error) {

        console.error("CREATE APPOINTMENT ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

const getAppointments = async (req, res) => {
    try {

        const filter = req.user.role === "security"
            ? { status: "approved" }
            : {};

        const appointments = await Appointment.find(filter)
            .sort({ _id: -1 });

        res.json(appointments);

    } catch (error) {

        console.error("GET APPOINTMENTS ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

const updateAppointmentStatus = async (req, res) => {

    try {

        const { status } = req.body;

        if (!["approved", "rejected"].includes(status)) {

            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const appointment =
            await Appointment.findByIdAndUpdate(
                req.params.id,
                { status },
                { new: true }
            );

        if (!appointment) {

            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        // Send email
        try {

            await sendAppointmentEmail(appointment);

            console.log(
                `Email sent to ${appointment.visitorEmail}`
            );

        } catch (emailError) {

            console.error(
                "EMAIL ERROR:",
                emailError.message
            );

            // Appointment still updates even if email fails
        }

        res.json(appointment);

    } catch (error) {

        console.error(
            "UPDATE APPOINTMENT ERROR:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createAppointment,
    getAppointments,
    updateAppointmentStatus
};

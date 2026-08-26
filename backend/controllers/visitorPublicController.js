const Visitor = require("../models/Visitor");
const Appointment = require("../models/Appointment");

const registerVisitor = async (req, res) => {
    try {
        const visitor = await Visitor.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            company: req.body.company,
            purpose: req.body.purpose,
            photo: req.file
                ? `/uploads/${req.file.filename}`
                : ""
        });

        const appointment = await Appointment.create({
            visitor: visitor.name,
            visitorEmail: visitor.email,
            host: req.body.host,
            date: req.body.date,
            time: req.body.time,
            purpose: req.body.purpose,
            status: "pending"
        });
        
        res.status(201).json({
            message: "Registration submitted successfully!",
            visitor,
            appointment
        });

    } catch (error) {
        console.error("PUBLIC REGISTRATION ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { registerVisitor };
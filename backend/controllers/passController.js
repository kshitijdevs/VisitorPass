const QRCode = require("qrcode");
const mongoose = require("mongoose");
const Pass = require("../models/pass");
const Visitor = require("../models/Visitor");
const Appointment = require("../models/Appointment");

const {
    createPassPDF
} = require("./pdfController");

const {
    sendPassEmail
} = require("../utils/email");

const getPasses = async (req, res) => {
    try {
        const passes = await Pass.find().sort({ _id: -1 });

        res.json(passes);
    } catch (error) {
        console.error("GET PASSES ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

const revokePass = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid pass" });
        }

        const pass = await Pass.findById(req.params.id);

        if (!pass) {
            return res.status(404).json({ message: "Pass not found" });
        }

        if (pass.status === "revoked") {
            return res.status(400).json({ message: "Pass is already revoked" });
        }

        pass.status = "revoked";
        await pass.save();

        res.json(pass);
    } catch (error) {
        console.error("REVOKE PASS ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

const revokeAllActivePasses = async (req, res) => {
    try {
        const result = await Pass.updateMany(
            { status: "active" },
            { status: "revoked" }
        );

        res.json({
            message: `${result.modifiedCount} active pass(es) revoked`,
            revokedCount: result.modifiedCount
        });
    } catch (error) {
        console.error("REVOKE ALL PASSES ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

const createPass = async (req, res) => {
    try {

        const { appointmentId, validFrom, validUntil } = req.body;

        if (!appointmentId || !validFrom || !validUntil) {
            return res.status(400).json({
                message: "Appointment, valid from and valid until are required"
            });
        }

        if (!mongoose.isValidObjectId(appointmentId)) {
            return res.status(400).json({ message: "Invalid appointment" });
        }

        const start = new Date(validFrom);
        const end = new Date(validUntil);

        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
            return res.status(400).json({
                message: "Valid until must be later than valid from"
            });
        }

        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (appointment.status !== "approved") {
            return res.status(400).json({
                message: "Only approved appointments can receive passes"
            });
        }

        const existingPass = await Pass.findOne({ appointmentId });

        if (existingPass) {
            return res.status(409).json({
                message: "A pass has already been issued for this appointment"
            });
        }

        const visitor = await Visitor.findOne({
            name: appointment.visitor,
            email: appointment.visitorEmail
        });

        if (!visitor) {
            return res.status(404).json({ message: "Visitor not found" });
        }

        // Find the highest existing pass number
        const passes = await Pass.find(
            { passNumber: { $regex: /^VP-\d+$/ } },
            { passNumber: 1 }
        );

        let highestNumber = 0;

        for (const existingPass of passes) {

            const match =
                existingPass.passNumber.match(/(\d+)$/);

            if (match) {

                const number =
                    parseInt(match[1], 10);

                if (number > highestNumber) {
                    highestNumber = number;
                }
            }
        }

        // Generate next pass number
        const nextNumber = highestNumber + 1;

        const passNumber =
            `VP-${String(nextNumber).padStart(4, "0")}`;


        // Generate QR code
        const qrData = JSON.stringify({
            passNumber: passNumber
        });

        const qrCode =
            await QRCode.toDataURL(qrData);


        // Create pass
        const pass = await Pass.create({

            visitor:
                appointment.visitor,

            visitorPhoto:
                visitor.photo || "",

            appointment:
                `${appointment.purpose} with ${appointment.host}`,

            appointmentId,

            host:
                appointment.host,

            purpose:
                appointment.purpose,

            date:
                appointment.date,

            time:
                appointment.time,

            // Automatically generated
            passNumber: passNumber,

            validFrom:
                start,

            validUntil:
                end,

            status:
                "active",

            qrCode: qrCode
        });


        // Generate PDF
        const pdfBuffer =
            await createPassPDF(pass);


        // Email PDF
        if (visitor && visitor.email) {

            try {

                await sendPassEmail(
                    pass,
                    visitor.email,
                    pdfBuffer
                );

                console.log(
                    `Pass PDF emailed to ${visitor.email}`
                );

            } catch (emailError) {

                console.error(
                    "PASS EMAIL ERROR:",
                    emailError.message
                );
            }

        } else {

            console.log(
                "Visitor email not found. Pass created without email."
            );
        }


        // Return created pass
        res.status(201).json(pass);

    } catch (error) {

        if (error.code === 11000) {
            return res.status(409).json({
                message: "A pass has already been issued for this appointment"
            });
        }

        console.error(
            "CREATE PASS ERROR:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    getPasses,
    revokePass,
    revokeAllActivePasses,
    createPass
};

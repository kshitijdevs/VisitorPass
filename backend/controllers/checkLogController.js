const CheckLog = require("../models/CheckLog");
const Pass = require("../models/pass");

// ==========================================
// CREATE CHECK-IN / CHECK-OUT LOG
// ==========================================

const createCheckLog = async (req, res) => {
    try {
        const {
            visitor,
            passNumber,
            action
        } = req.body;

        if (!visitor || !passNumber || !action) {
            return res.status(400).json({
                message: "Visitor, pass number and action are required"
            });
        }

        if (
            action !== "check-in" &&
            action !== "check-out"
        ) {
            return res.status(400).json({
                message: "Invalid action"
            });
        }

        const pass = await Pass.findOne({
            passNumber
        });

        if (!pass) {
            return res.status(404).json({
                message: "Pass not found"
            });
        }

        const now = new Date();

        if (
            now < new Date(pass.validFrom) ||
            now > new Date(pass.validUntil)
        ) {
            return res.status(403).json({
                message: "Pass is not valid at this time"
            });
        }

        // Get latest log for this pass
        const lastLog = await CheckLog.findOne({
            passNumber
        }).sort({
            createdAt: -1
        });

        // Prevent duplicate check-in
        if (
            action === "check-in" &&
            lastLog &&
            lastLog.action === "check-in"
        ) {
            return res.status(400).json({
                message: "Visitor is already checked in"
            });
        }

        // Prevent checkout before check-in
        if (
            action === "check-out" &&
            (!lastLog || lastLog.action !== "check-in")
        ) {
            return res.status(400).json({
                message: "Visitor is not checked in"
            });
        }

        const checkLog = await CheckLog.create({
            visitor,
            passNumber,
            action
        });

        res.status(201).json(checkLog);

    } catch (error) {
        console.error(
            "CHECK LOG ERROR:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};


// ==========================================
// GET ALL CHECK LOGS
// ==========================================

const getCheckLogs = async (req, res) => {
    try {
        const logs = await CheckLog.find()
            .sort({
                createdAt: -1
            });

        res.status(200).json(logs);

    } catch (error) {
        console.error(
            "GET CHECK LOGS ERROR:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createCheckLog,
    getCheckLogs
};
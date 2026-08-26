const Visitor = require("../models/Visitor");
const Pass = require("../models/pass");
const Appointment = require("../models/Appointment");
const CheckLog = require("../models/CheckLog");

const getDashboardStats = async (req, res) => {
    try {

        const role = req.user.role;

        // ==========================================
        // SECURITY DASHBOARD
        // ==========================================

        if (role === "security") {

            const now = new Date();

            const activePasses = await Pass.countDocuments({
                validFrom: { $lte: now },
                validUntil: { $gte: now }
            });

            const checkIns = await CheckLog.countDocuments({
                action: "check-in"
            });

            const checkOuts = await CheckLog.countDocuments({
                action: "check-out"
            });

            const currentlyCheckedIn = Math.max(
                0,
                checkIns - checkOuts
            );

            return res.json({
                totalVisitors: 0,
                activePasses,
                currentlyCheckedIn,
                totalAppointments: 0,
                recentVisitors: []
            });
        }


        // ==========================================
        // EMPLOYEE DASHBOARD
        // ==========================================

        if (role === "employee") {

            const totalVisitors =
                await Visitor.countDocuments();

            const totalAppointments =
                await Appointment.countDocuments();

            const recentVisitors =
                await Visitor.find()
                    .sort({ _id: -1 })
                    .limit(5);

            return res.json({
                totalVisitors,
                activePasses: 0,
                currentlyCheckedIn: 0,
                totalAppointments,
                recentVisitors
            });
        }


        // ==========================================
        // ADMIN DASHBOARD
        // ==========================================

        if (role === "admin") {

            const totalVisitors =
                await Visitor.countDocuments();

            const now = new Date();

            const activePasses =
                await Pass.countDocuments({
                    validFrom: { $lte: now },
                    validUntil: { $gte: now }
                });

            const totalAppointments =
                await Appointment.countDocuments();

            const checkIns =
                await CheckLog.countDocuments({
                    action: "check-in"
                });

            const checkOuts =
                await CheckLog.countDocuments({
                    action: "check-out"
                });

            const currentlyCheckedIn =
                Math.max(
                    0,
                    checkIns - checkOuts
                );

            const recentVisitors =
                await Visitor.find()
                    .sort({ _id: -1 })
                    .limit(5);

            return res.json({
                totalVisitors,
                activePasses,
                currentlyCheckedIn,
                totalAppointments,
                recentVisitors
            });
        }


        // ==========================================
        // UNKNOWN ROLE
        // ==========================================

        return res.status(403).json({
            message: "Access denied"
        });

    } catch (error) {

        console.error(
            "DASHBOARD ERROR:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    getDashboardStats
};
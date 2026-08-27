
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/user");
const Visitor = require("./models/Visitor");
const Appointment = require("./models/Appointment");
const Pass = require("./models/pass");

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        // Clear demo data
        await User.deleteMany({});
        await Visitor.deleteMany({});
        await Appointment.deleteMany({});
        await Pass.deleteMany({});

        // Passwords
        const adminPassword = await bcrypt.hash("admin123", 10);
        const securityPassword = await bcrypt.hash("security123", 10);
        const employeePassword = await bcrypt.hash("employee123", 10);

        // Users
        await User.create([
            {
                name: "Admin User",
                email: "admin@visitorpass.com",
                password: adminPassword,
                role: "admin"
            },
            {
                name: "Security User",
                email: "security@visitorpass.com",
                password: securityPassword,
                role: "security"
            },
            {
                name: "Employee User",
                email: "employee@visitorpass.com",
                password: employeePassword,
                role: "employee"
            }
        ]);

        // Visitors
        const visitors = await Visitor.create([
            {
                name: "Rishi Sharma",
                email: "rishi@example.com",
                phone: "9876543210",
                company: "ABC Technologies",
                purpose: "Meeting"
            },
            {
                name: "Rahul Kumar",
                email: "rahul@example.com",
                phone: "9876543211",
                company: "XYZ Solutions",
                purpose: "Interview"
            },
            {
                name: "Amit Singh",
                email: "amit@example.com",
                phone: "9876543212",
                company: "Tech Corp",
                purpose: "Business Meeting"
            }
        ]);

        // Appointments
        const appointments = await Appointment.create([
            {
                visitor: visitors[0].name,
                visitorEmail: visitors[0].email,
                host: "Employee User",
                date: "2026-08-26",
                time: "10:00",
                purpose: "Meeting",
                status: "approved"
            },
            {
                visitor: visitors[1].name,
                visitorEmail: visitors[1].email,
                host: "Employee User",
                date: "2026-08-27",
                time: "11:00",
                purpose: "Interview",
                status: "pending"
            },
            {
                visitor: visitors[2].name,
                visitorEmail: visitors[2].email,
                host: "Employee User",
                date: "2026-08-28",
                time: "14:00",
                purpose: "Business Meeting",
                status: "approved"
            }
        ]);

        console.log("Demo data created successfully!");

        console.log("\nLogin accounts:");
        console.log("Admin:    admin@visitorpass.com / admin123");
        console.log("Security: security@visitorpass.com / security123");
        console.log("Employee: employee@visitorpass.com / employee123");

        console.log("\nAppointments created:", appointments.length);

        await mongoose.disconnect();

        console.log("\nDatabase connection closed.");
    } catch (error) {
        console.error("Seed error:", error);
        process.exit(1);
    }
};

seedDatabase();

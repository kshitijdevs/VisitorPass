const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


// ==========================================
// DATABASE
// ==========================================

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });


// ==========================================
// AUTH MIDDLEWARE
// ==========================================

const protect = require("./middleware/authMiddleware");
const authorize = require("./middleware/roleMiddleware");


// ==========================================
// ROUTES
// ==========================================

const userRoutes = require("./routes/userRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const visitorPublicRoutes = require("./routes/visitorPublicRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const passRoutes = require("./routes/passRoutes");
const checkLogRoutes = require("./routes/checkLogRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const pdfRoutes = require("./routes/pdfRoutes");


// ==========================================
// PUBLIC VISITOR REGISTRATION
// ==========================================

app.use(
    "/api/visitor-register",
    visitorPublicRoutes
);


// ==========================================
// LOGIN / USER ROUTES
// ==========================================

app.use(
    "/api/users",
    userRoutes
);


// ==========================================
// VISITORS
// ADMIN + EMPLOYEE
// ==========================================

app.use(
    "/api/visitors",
    protect,
    authorize("admin", "employee"),
    visitorRoutes
);


// ==========================================
// APPOINTMENTS
// ADMIN + EMPLOYEE
// ==========================================

app.use(
    "/api/appointments",
    protect,
    authorize("admin", "employee"),
    appointmentRoutes
);


// ==========================================
// PASSES
// ADMIN + SECURITY
// ==========================================

app.use(
    "/api/passes",
    protect,
    authorize("admin", "security"),
    passRoutes
);


// ==========================================
// CHECK IN / CHECK OUT
// ADMIN + SECURITY
// ==========================================

app.use(
    "/api/checklogs",
    protect,
    authorize("admin", "security"),
    checkLogRoutes
);


// ==========================================
// PDF
// ADMIN + SECURITY
// ==========================================

app.use(
    "/api/pdf",
    protect,
    authorize("admin", "security"),
    pdfRoutes
);


// ==========================================
// DASHBOARD
// LOGGED-IN USERS
// ==========================================

app.use(
    "/api/dashboard",
    protect,
    dashboardRoutes
);


// ==========================================
// SERVER
// ==========================================

app.listen(process.env.PORT, () => {
    console.log(
        `Server running on port ${process.env.PORT}`
    );
});
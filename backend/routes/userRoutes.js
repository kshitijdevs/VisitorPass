const express = require("express");

const {
    createUser,
    loginUser
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, authorize("admin"), createUser);

router.post("/login", loginUser);

module.exports = router;

const express = require("express");

const {
    createCheckLog,
    getCheckLogs
} = require("../controllers/checkLogController");

const router = express.Router();

router.post("/", createCheckLog);

router.get("/", getCheckLogs);

module.exports = router;
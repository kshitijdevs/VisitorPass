const express = require("express");
const {
    getPasses,
    createPass
} = require("../controllers/passController");

const router = express.Router();

router.get("/", getPasses);

router.post("/", createPass);

module.exports = router;

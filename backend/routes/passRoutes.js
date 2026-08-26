const express = require("express");
const { createPass } = require("../controllers/passController");

const router = express.Router();

router.post("/", createPass);

module.exports = router;
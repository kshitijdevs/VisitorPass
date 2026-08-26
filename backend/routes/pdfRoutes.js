const express = require("express");

const { generatePassPDF } = require("../controllers/pdfController");

const router = express.Router();

router.post("/", generatePassPDF);

module.exports = router;
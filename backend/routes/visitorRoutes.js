const express = require("express");

const {
    createVisitor,
    getVisitors
} = require("../controllers/visitorController");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", getVisitors);

router.post("/", upload.single("photo"), createVisitor);

module.exports = router;
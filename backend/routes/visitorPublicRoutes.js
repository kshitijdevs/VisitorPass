const express = require("express");

const {
    registerVisitor
} = require("../controllers/visitorPublicController");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
    "/",
    upload.single("photo"),
    registerVisitor
);

module.exports = router;
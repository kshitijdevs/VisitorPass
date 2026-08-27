const express = require("express");
const {
    getPasses,
    revokePass,
    revokeAllActivePasses,
    createPass
} = require("../controllers/passController");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getPasses);

router.patch("/revoke-all", authorize("admin"), revokeAllActivePasses);

router.patch("/:id/revoke", revokePass);

router.post("/", createPass);

module.exports = router;

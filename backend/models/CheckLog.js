const mongoose = require("mongoose");

const checkLogSchema = new mongoose.Schema(
    {
        visitor: {
            type: String,
            required: true
        },

        passNumber: {
            type: String,
            required: true
        },

        action: {
            type: String,
            enum: ["check-in", "check-out"],
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "CheckLog",
    checkLogSchema
);
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({

    visitor: {
        type: String,
        required: true
    },

    visitorEmail: {
        type: String,
        required: true
    },

    host: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    purpose: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "pending"
    }

});

module.exports = mongoose.model("Appointment", appointmentSchema);
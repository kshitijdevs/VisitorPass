const mongoose = require("mongoose");

const passSchema = new mongoose.Schema({
    visitor: {
        type: String,
        required: true
    },

    visitorPhoto: {
        type: String,
        default: ""
    },

    appointment: {
        type: String,
        required: true
    },

    host: {
        type: String,
        default: ""
    },

    purpose: {
        type: String,
        default: ""
    },

    date: {
        type: String,
        default: ""
    },

    time: {
        type: String,
        default: ""
    },

    passNumber: {
        type: String,
        required: true,
        unique: true
    },

    validFrom: {
        type: Date,
        required: true
    },

    validUntil: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        default: "active"
    },

    qrCode: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("Pass", passSchema);
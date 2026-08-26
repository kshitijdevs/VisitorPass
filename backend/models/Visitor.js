const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    company: {
        type: String,
        required: true
    },

    purpose: {
        type: String,
        required: true
    },

    photo: {
        type: String,
        default: ""
    }

});

module.exports = mongoose.model("Visitor", visitorSchema);
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    mobile: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    usercreationdate: {
        type: Date,
        default: Date.now
    }
});
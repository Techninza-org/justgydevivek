const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    mobile: {
        type: Number,
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
        type: Date
    },
    role: {
        type: String,
        default: 'Admin'
    }
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
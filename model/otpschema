const mongoose = require('mongoose');

const otpTokenSchema = new mongoose.Schema({
    otpToken: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }
});

const Otpschema=mongoose.model('Otpschema',otpTokenSchema);
module.exports=Otpschema;
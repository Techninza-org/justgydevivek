const mongoose = require('mongoose');

const aboutusSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        path: String,
    }
});

const Aboutus = mongoose.model('Aboutus', aboutusSchema);
module.exports = Aboutus;
const mongoose = require('mongoose');

var adminSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
});

module.exports = mongoose.model("vras-admin", adminSchema);


const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    mobileno: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
});

module.exports = mongoose.model("vras", userSchema);

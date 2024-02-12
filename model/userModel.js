// const mongoose = require('mongoose');

// var userSchema = mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//     },
//     mobileno: {
//         type: String,
//         required: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
// });

// module.exports = mongoose.model("vras", userSchema);

const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobileno: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },

});

mongoose.model('vras', userSchema);

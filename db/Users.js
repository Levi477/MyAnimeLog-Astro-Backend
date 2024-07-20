const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    createdAt: Date,
    comments : Array,
    ratings : Array

});

module.exports = mongoose.model("User",userSchema);
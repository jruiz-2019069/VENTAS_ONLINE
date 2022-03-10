"use strict"
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: String,
    surname: String,
    role: String,
    username: String,
    email: String,
    password: String
});

module.exports = mongoose.model("User", userSchema);
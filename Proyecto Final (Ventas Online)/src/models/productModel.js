"use strict"
const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    stock: Number,
    totalSales: Number,
    category: {type: mongoose.Schema.ObjectId, ref: "Category"}
});

module.exports = mongoose.model("Product", productSchema);
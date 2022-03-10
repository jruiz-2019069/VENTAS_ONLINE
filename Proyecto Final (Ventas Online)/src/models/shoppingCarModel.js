"use strict"
const mongoose = require("mongoose");

const shoppingCarSchema = mongoose.Schema({
    user: {type: mongoose.Schema.ObjectId, ref: "User"},
    products: [{books: 
                {idBook: {type: mongoose.Schema.ObjectId, ref: "Product"},
                name: String,
                quantity: Number,
                price: Number,
                subTotal: Number}
            }],
    total: Number
});

module.exports = mongoose.model("ShoppingCar", shoppingCarSchema);
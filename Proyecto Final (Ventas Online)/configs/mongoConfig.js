"use strict"
const mongoose = require("mongoose");

exports.init = () => {
    const uriMongo = "mongodb://127.0.0.1:27017/VentasOnlineDB";
    
    mongoose.Promise = global.Promise;
    
    mongoose.connection.on("error", () => {
        console.log("Database connection error.");
        mongoose.disconnect();
    });
    mongoose.connection.on("connecting", () => {
        console.log("Connecting to MongoDB.");
    });
    mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB.");
    });
    mongoose.connection.once("open", () => {
        console.log("Successful connection to the database.");
    });
    mongoose.connection.on("reconnected", () => {
        console.log("Successfully reconnected to MongoDB.");
    });
    mongoose.connection.on("disconnected", () => {
        console.log("Error connecting to MongoDB.");
    });
    mongoose.connect(uriMongo, {
        maxPoolSize: 10,
        wtimeoutMS: 2500,
        useNewUrlParser: true
    }).catch(err => console.log(err));
};
"use strict"
const shoppingCarController = require("../controllers/shoppingCarController");
const express = require("express");
const mdAuth = require("../services/middlewares");

const api = express.Router();

//RUTAS
api.get("/test", shoppingCarController.test);
api.put("/addPurchase", mdAuth.verifyLogin, shoppingCarController.addPurchase);

module.exports = api;
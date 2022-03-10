"use strict"
const express = require("express");
const productController = require("../controllers/productController");
const mdAuth = require("../services/middlewares");

const api = express.Router();

//RUTAS
api.get("/test", productController.test);
api.post("/addProduct", [mdAuth.verifyLogin, mdAuth.isAdmin], productController.addProduct);
api.put("/updateProduct/:id", [mdAuth.verifyLogin, mdAuth.isAdmin], productController.updateProduct);
api.delete("/deleteProduct/:id", [mdAuth.verifyLogin, mdAuth.isAdmin], productController.deleteProduct);
api.get("/getProducts", [mdAuth.verifyLogin, mdAuth.isAdmin], productController.getProducts);
api.get("/getProductID/:id", [mdAuth.verifyLogin, mdAuth.isAdmin], productController.getProductID);
api.get("/getSoldOutProducts", [mdAuth.verifyLogin, mdAuth.isAdmin], productController.getSoldOutProducts);
api.get("/getProductName", mdAuth.verifyLogin, productController.getProductName);
api.get("/mostSelledProducts", [mdAuth.verifyLogin, mdAuth.isAdmin], productController.mostSelledProducts);

module.exports = api;
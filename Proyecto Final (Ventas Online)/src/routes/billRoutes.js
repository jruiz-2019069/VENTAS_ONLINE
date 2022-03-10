"use strict"
const express = require("express");
const billController = require("../controllers/billController");
const mdAuth = require("../services/middlewares");

const api = express.Router();

//RUTAS
api.get("/test", billController.test);
api.post("/generateBill", mdAuth.verifyLogin, billController.generateBill);
api.get("/getBillsByUser/:id", [mdAuth.verifyLogin, mdAuth.isAdmin], billController.getBillsByUser);
api.get("/getBillById/:id", [mdAuth.verifyLogin, mdAuth.isAdmin], billController.getBillById);
api.put("/updateBill/:id", [mdAuth.verifyLogin, mdAuth.isAdmin], billController.updateBill);

module.exports = api;
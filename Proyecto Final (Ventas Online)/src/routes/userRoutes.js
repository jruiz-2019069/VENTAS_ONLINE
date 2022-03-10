"use strict"
const express = require("express");
const userController = require("../controllers/userController");
const mdAuth = require("../services/middlewares");

const api = express.Router();

//RUTAS
api.get("/test", [mdAuth.verifyLogin, mdAuth.isAdmin], userController.test);
api.post("/register", userController.register);
api.post("/login", userController.login);
api.delete("/deleteUser/:id", mdAuth.verifyLogin, userController.deleteUser);
api.put("/updateUser/:id", mdAuth.verifyLogin, userController.updateUser);
api.post("/addUser", [mdAuth.verifyLogin, mdAuth.isAdmin], userController.addUser);
api.put("/manageUpdate/:id", [mdAuth.verifyLogin, mdAuth.isAdmin], userController.manageUpdate);
api.delete("/manageDelete/:id", [mdAuth.verifyLogin, mdAuth.isAdmin], userController.manageDelete);

module.exports = api;
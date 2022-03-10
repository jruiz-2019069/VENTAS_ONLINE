"use strict"
const express = require("express");
const categoryController = require("../controllers/categoryController");
const mdAuth = require("../services/middlewares");

const api = express.Router();

//RUTAS
api.get("/test", categoryController.test);
api.post("/addCategory", [mdAuth.verifyLogin, mdAuth.isAdmin], categoryController.addCategory);
api.put("/updateCategory/:id", [mdAuth.verifyLogin, mdAuth.isAdmin], categoryController.updateCategory);
api.get("/getCategories", mdAuth.verifyLogin, categoryController.getCategories);
api.get("/showProductCategory", mdAuth.verifyLogin, categoryController.showProductCategory);
api.delete("/deleteCategory/:id", [mdAuth.verifyLogin, mdAuth.isAdmin], categoryController.deleteCategory);

module.exports = api;
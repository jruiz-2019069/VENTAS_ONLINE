"use strict"
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("../src/routes/userRoutes");
const categoryRoutes = require("../src/routes/categoryRoutes");
const productRoutes = require("../src/routes/productRoutes");
const shoppingCarRoutes = require("../src/routes/shoppingCarRoutes");
const billRoutes = require("../src/routes/billRoutes");

const app = express();

//CONFIGURACIONES INTERNAS
app.use(helmet());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

//CONFIGURACIONES DE SOLICITUDES
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/shoppingCar", shoppingCarRoutes);
app.use("/bill", billRoutes);

module.exports = app;



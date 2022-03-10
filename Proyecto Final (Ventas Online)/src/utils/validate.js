"use strict"
const User = require("../models/userModel");
const bcrypt = require("bcrypt-nodejs");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");


exports.validateData = (data) => {
    const campos = Object.keys(data);
    let msg = "";
    for(let campo of campos){
        if(data[campo] !== null && data[campo] !== "" && data[campo] !== undefined) continue;
        msg += `El parámetro ${campo} es obligatorio.\n`;
    }
    return msg.trim();
}

exports.userExist = async (username) => {
    try {
        return await User.findOne({username: username});
    } catch (error) {
        console.log(error);
        return error;
    }
};

exports.encrypt = async (password) => {
    try {
        return bcrypt.hashSync(password);
    } catch (error) {
        console.log(error);
        return error;
    }
}

exports.checkPassword = async (password, hash) => {
    try {
        return await bcrypt.compareSync(password, hash);
    } catch (error) {
        console.log(error);
        return error;
    }
}

exports.checkPermission = (idUser, sub) => {
    if(idUser !== sub){
        return false;
    }else{
        return true;
    }
}

//FUNCION CORRESPONDIENTE A CATEGORY
exports.categoryExist = async (namecategory) => {
    try {
        return await Category.findOne({name: namecategory});
    } catch (error) {
        console.log(error);
        return error;
    }
}

//FUNCION CORRESPONDIENTE A PRODUCT
exports.productExist = async (product) => {
    try {
        return await Product.findOne({name: product});
    } catch (error) {
        console.log(error);
        return error;
    }
}

//FUNCION PARA BUSCAR PRODUCTO POR ID
exports.productIdExist = async (id) => {
    try {
        return await Product.findOne({_id: id});
    } catch (error) {
        console.log(error);
        return error;
    }
}

//FUNCION PARA VERIFICAR QUE EL FORMULARIO NO ESTE VACIO
exports.checkUpdate = async (formulario) => {
    try {
        if(Object.entries(formulario).length === 0){
            return false;
        }else{
            return true;
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

exports.checkData = async (formulario) => {
    try {
        if(formulario.name === "" || formulario.price === "" || formulario.description === "" || formulario.stock === "" || formulario.category === ""){
            return false;
        }else{
            return true;
        }
    } catch (error) {
        console.log(error);
        return error;
    }
};

//ELIMINAR DATA SENSIBLE (ID Y __V DE CATEGORIA)
exports.sensitiveData = async (data) => {
    try {
        if(data){
            delete data.category._id;
            delete data.category.__v;
            return data;
        }else{
            return "";
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

//FUNCION PARA MANEJAR LOS PRODUCTOS AGOTADOS.
exports.stockEmpty = async (product) => {
    try {
        if(product.stock === 0){
            return product;
        }else{
            return "";
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

//FUNCION PARA BUSCAR EL PRODUCTO (ENCONTRAR COINCIDENCIA Y INSENSITIVE CASE)
exports.searchProduct = async (productName) => {
    try {
        return await Product.findOne({name: {$regex: productName, $options: "i"}}).populate("category").lean();
    } catch (error) {
        console.log(error);
        return error;
    }
}

//ELIMINAR DATA SENSIBLE (ID Y __V DE CATEGORIA)
exports.sensitiveDataClient = async (data) => {
    if(data){
        delete data.stock;
        delete data.totalSales;
        delete data.__v;
        delete data.category._id;
        delete data.category.__v;
        return data;
    }else{
        return "";
    }
}

//FUNCION PARA ORDENAR PRODUCTOS DE MANERA DESCENDENTE POR MEDIO DE SU TOTALSALES.
exports.orderProducts = async (products) => {
    try {
        products.sort((a, b) => b.totalSales - a.totalSales);
        return products;
    } catch (error) {
        console.log(error);
        return error;
    }
}


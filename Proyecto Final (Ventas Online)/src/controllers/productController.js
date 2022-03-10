"use strict"
const Product = require("../models/productModel");
const {validateData, productExist, checkUpdate, checkData, productIdExist, sensitiveData, stockEmpty, searchProduct, sensitiveDataClient, orderProducts} = require("../utils/validate");

exports.test = (req, res) => {
    return res.send({message: "Test running!"});
}

//FUNCION PARA AGREGAR UN PRODUCTO E INGRESANDO SU CATEGORÍA CORRESPONDIENTE.
exports.addProduct = async (req, res) => {
    try {
        const formulario = req.body;
        const data = {
            name: formulario.name,
            price: formulario.price,
            description: formulario.description,
            stock: formulario.stock,
            totalSales: 0,
            category: formulario.category
        };
        const msg = validateData(data);
        if(msg){
            return res.send(msg);
        }else{
            if(await productExist(formulario.name)){
                return res.send({message: "¡Product already exist!"});
            }else{
                if(formulario.stock >= 0 && formulario.price >= 0){
                    let producto = new Product(data);
                    await producto.save();
                    return res.send({message: "¡Product created!"});
                }else{
                    return res.send({message: "¡The number of stock or price is negative!"});
                }
            }
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

//ACTUALIZO UN PRODUCTO VALIDANDO EL NOMBRE QUE SE MANDA.
exports.updateProduct = async (req, res) => {
    try {
        const idProduct = req.params.id;
        const formulario = req.body;
        if(await checkUpdate(formulario) && await checkData(formulario)){
            if(formulario.name){
                if(await productExist(formulario.name)){
                    return res.send({message: "¡The name of product already exist!"});
                }else{
                    const productUpdated = await Product.findOneAndUpdate({_id: idProduct}, formulario, {new: true});
                    return res.send({message: "Product updated.", productUpdated});
                }
            }else{
                const productUpdated = await Product.findOneAndUpdate({_id: idProduct}, formulario, {new: true});
                return res.send({message: "Product updated.", productUpdated});
            }
        }else{
            return res.send({message: "Form is empty."});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

//BORRO UN PRODUCTO POR MEDIO DE SU ID.
exports.deleteProduct = async (req, res) => {
    try {
        const idProduct = req.params.id;
        if(await productIdExist(idProduct)){
            const productDeleted = await Product.findOneAndDelete({_id: idProduct});
            return res.send({message: "Product deleted.", productDeleted});
        }else{
            return res.send({message: "Product does not found."});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
};

//Obtener todos los productos.
exports.getProducts = async (req, res) => {
    try {   
        const products = await Product.find().populate("category").lean();
        if(products){
            const clearProducts = [];
            for(let producto of products){
                clearProducts.push(await sensitiveData(producto));
            }
            return res.send({clearProducts});
        }else{
            return res.send({message: "Products does not found."});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
};

//Obtener un producto por su ID.
exports.getProductID = async (req, res) => {
    try {
        const idProduct = req.params.id;
        const producto = await Product.findOne({_id: idProduct}).populate("category").lean();
        if(producto){
            return res.send(await sensitiveData(producto));
        }else{
            return res.send({message: "Product does not found."});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

//Función para ver productos agotados.
exports.getSoldOutProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("category").lean();
        if(products){
            const clearProducts = [];
            for(let producto of products){
                //clearProducts.push(await stockEmpty(producto));
                clearProducts.push(await sensitiveData(await stockEmpty(producto)));
            }
            return res.send({message: "Sold out products: ", clearProducts});
        }else{
            return res.send({message: "There are not productos to show."});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
};

//Funcion para buscar producto por su nombre.
exports.getProductName = async (req, res) => {
    try {
        const formulario = req.body;
        const data = {
            name: formulario.name
        }
        const msg = validateData(data);
        if(msg){
            return res.send(msg);
        }else{
            const product = await searchProduct(formulario.name);
            if(product){
                return res.send(await sensitiveDataClient(product));
            }else{
                return res.send({message: "Product does not found."});
            }
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

//Funcion para mostras los productos mas vendidos.
exports.mostSelledProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("category").lean();
        if(products){
            const clearProducts = [];
            for(let producto of products){
                clearProducts.push(await sensitiveData(producto));
            }
            return res.send(await orderProducts(clearProducts));
        }else{
            return res.send({message: "There are not productos to show."});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}
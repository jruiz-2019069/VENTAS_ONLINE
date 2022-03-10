"use strict"
const Category = require("../models/categoryModel");
const {validateData, categoryExist, sensitiveData} = require("../utils/validate");
const Producto = require("../models/productModel");

exports.test = (req, res) => {
    return res.send({message: "Test running."});
};

//FUNCION PARA AGREGAR UNA CATEGORÍA
exports.addCategory = async (req, res) => {
    try {
        const formulario = req.body;
        const data = {
            name: formulario.name
        };
        const msg = await validateData(data);
        if(msg){
            return res.send(msg);
        }else{
            if(await categoryExist(formulario.name)){
                return res.send({message: "¡Category already exist!"});
            }else{
                let categoria = new Category(data);
                await categoria.save();
                return res.send({message: "¡Category created!"});
            }
        }
    } catch (error) {
        console.log(error);
        return error;
    }
};

//FUNCION PARA ACTUALIZAR UNA CATEGORÍA
exports.updateCategory = async (req, res) => {
    try {
        const idCategory = req.params.id;
        const formulario = req.body;
        const data = {
            name: formulario.name
        }
        const msg = validateData(data);
        if(msg){
            return res.send(msg);
        }else{
            if(await categoryExist(formulario.name)){
                return res.send({message: "¡Category already exist!"});
            }else{
                const categoryUpdated = await Category.findOneAndUpdate({_id: idCategory}, formulario, {new: true});
                if(categoryUpdated){
                    return res.send({message: "¡Category updated!", categoryUpdated});
                }else{
                    return res.send({message: "Category not found."});
                }
            }
        }
    } catch (error) {
        console.log(error);
        return error;
    }
};

//FUNCION PARA OBTENER TODAS LAS CATEGORÍAS EXISTENTES.
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.send({categories});
    } catch (error) {
        console.log(error);
        return error;
    }
};

//FUNCION PARA VER LOS PRODUCTOS POR SU CATEGORÍA.
exports.showProductCategory = async (req, res) => {
    try {
        const formulario = req.body;
        const nameCategory = await Category.findOne({name: formulario.name});
        if(nameCategory){
            const products = await Producto.find().populate("category").lean();
            const clearProducts = [];
            for(let producto of products){
                if(producto.category.name === formulario.name){
                    clearProducts.push(await sensitiveData(producto));
                }
            }
            return res.send(clearProducts);
        }else{
            return res.send({message: "Category not found."});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
};

//FUNCION DELETE CATEGORY CON LA VALIDACION INDICADA
exports.deleteCategory = async (req, res) => {
    try {
        const idCategory = req.params.id;
        const searchCategory = await Category.findOne({_id: idCategory});
        if(searchCategory && searchCategory.name !== "Default"){
            const products = await Producto.find({category: idCategory}).lean();
            if(Object.entries(products).length === 0){
                const categoryDeleted = await Category.findOneAndDelete({_id: idCategory});
                return res.send({message: "Catefory deleted", categoryDeleted});
            }else{
                const idCategoryDefault = await Category.findOne({name: "Default"});
                const productsUpdated = await Producto.updateMany({category: idCategory}, {$set: {category: idCategoryDefault._id}});
                const categoryDeleted = await Category.findOneAndDelete({_id: idCategory});
                return res.send({message: "Catefory deleted", categoryDeleted});
            }
        }else{
            return res.send({message: "Category not found or you are sending category default."});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}
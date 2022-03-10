"use strict"
const {validateData} = require("../utils/validate");
const Producto = require("../models/productModel");
const ShoppingCar = require("../models/shoppingCarModel");

exports.test = (req, res) => {
    return res.send({message: "Test running."});
}

//FUNCION PARA AGREGAR COMPRA
exports.addPurchase = async (req, res) => {
    try {
        const formulario = req.body;
        const data = {
            name: formulario.name,
            quantity: formulario.quantity
        }
        const msg = validateData(data);
        if(req.user.role != "ADMIN"){
            if(msg){
                return res.send(msg);
            }else{
                //Busco si el producto mandado existe.
                const searchProduct = await Producto.findOne({name: formulario.name});
                if(searchProduct){
                    if(searchProduct.stock >= formulario.quantity){
                        //Agregar los productos al arreglo del carrito de compras.
                        const shoppingCarUpdated = await ShoppingCar.findOneAndUpdate({user: req.user.sub}, {
                            $push: {
                                products: [{
                                    books: 
                                        {idBook: searchProduct._id, name: formulario.name, quantity: formulario.quantity, price: searchProduct.price, subTotal: (searchProduct.price*formulario.quantity)}
                                }]
                            }   
                        }, {new: true});
                        //Buscar carrito para luego acceder al arreglo
                        const searchCar = await ShoppingCar.findOne({user: req.user.sub}).lean();
                        //Convierto el objeto a un arreglo de objetos para saber su longuitud y recorrerlo.
                        let arrayBooks = Object.entries(searchCar.products);
                        let total = 0;
                        for(let i = 0; i < arrayBooks.length; i++){
                            total = total + searchCar.products[i].books.subTotal;
                        }
                        //Actualizo el total que sería la suma de todos los subTotales.
                        const shoppingCarUpdatedTotal = await ShoppingCar.findOneAndUpdate({user: req.user.sub}, {total: total}, {new:true});
                        return res.send({message: "Purchase added.", shoppingCarUpdatedTotal});
                    }else{
                        return res.send({message: "We do not have enough products to add to your purchase."});
                    }
                }else{
                    return res.send({message: "Non-existing product."});
                }
            }
        }else{
            return res.send({message: "Admins can not add purchase."});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}
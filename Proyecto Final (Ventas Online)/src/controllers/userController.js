"use strict"
const User = require("../models/userModel");
const {validateData, userExist, encrypt, checkPassword, checkPermission} = require("../utils/validate");
const jwt = require("../services/jwt");
const ShoppingCar = require("../models/shoppingCarModel");
const Bill = require("../models/billModel");

exports.test = (req, res) => {
    return res.send({message: "Test running!"});
}

//INSERTAR UN USUARIO EN LA BASE DE DATOS
exports.register = async (req, res) => {
    try {
        const formulario = req.body;
        const data = {
            name: formulario.name,
            surname: formulario.surname,
            username: formulario.username,
            password: await encrypt(formulario.password), //Jose Ruiz - 123
            email: formulario.email,
            role: "CLIENT"
        };
        let msg = validateData(data);
        if(msg){
            return res.send(msg);
        }else{
            if(await userExist(formulario.username)){
                return res.send({message: "¡The user name already exist!"});
            }else{
                let usuario = new User(data);
                await usuario.save();
                return res.send({message: "¡User created!"});
            }
        }
    } catch (error) {
        console.log(error);
        return error;
    }
};

//LOGEO DE UNA USUARIO, CADA VEZ QUE SE LOGEA SE LE CREA UN TOKEN Y SE LE MUESTRAN SUS FACTURAS.
exports.login = async (req, res) => {
    try {   
        const formulario = req.body;
        const data = {
            username: formulario.username,
            password: formulario.password
        };
        const msg = validateData(data);
        if(msg){
            return res.send(msg);
        }else{
            const alreadyUser = await userExist(formulario.username);
            if(alreadyUser && await checkPassword(formulario.password, alreadyUser.password)){
                const token = await jwt.createToken(alreadyUser);
                if(alreadyUser.role === "CLIENT"){
                    const data2 = {
                        user: alreadyUser._id,
                        total: 0
                    }
                    let shoppingCar = new ShoppingCar(data2);
                    const searchCar = await ShoppingCar.findOne({user: alreadyUser._id});
                    if(!searchCar){
                        await shoppingCar.save();
                        //FACTURAS DE UN USUARIO
                        const bills = await Bill.find({user: alreadyUser._id});
                        return res.send({message: "¡User login!", token, bills});
                    }else{
                        //FACTURAS DE UN USUARIO
                        const bills = await Bill.find({user: alreadyUser._id});                        
                        return res.send({message: "This user already has a shopping car.", token, bills});
                    }
                }else{
                    return res.send({message: "¡User login!", token});
                }
            }else{
                return res.send({message: "¡Username or password incorrect!"});
            }
        }
    } catch (error) {
        console.log(error);
        return error;
    }
};

//BORRAR UN USUARIO SIENDO ROLE CLIENTE **nota** UN CLIENTE SOLO SE PUEDE ELIMINAR A EL MISMO.
exports.deleteUser = async (req, res) => {
    try {
        const idUser = req.params.id;
        if(await checkPermission(idUser, req.user.sub)){
            const userDeleted = await User.findOneAndDelete({_id: idUser});
            if(userDeleted){
                const shoppingCarDeleted = await ShoppingCar.findOneAndDelete({user: idUser});
                return res.send({message: "¡User deleted!", userDeleted});
            }else{
                return res.send({message: "User does not found."});
            }
        }else{
            return res.send({message: "¡You can not delete this account!"});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
};

//ACTUALIZAR UN USUARIO SIENDO ROLE CLIENTE **nota** UN CLIENTE SOLO SE PUEDE EDITAR A EL MISMO.
exports.updateUser = async (req, res) => {
    try {
        const idUser = req.params.id;
        const formulario = req.body;
        if(await checkPermission(idUser, req.user.sub)){
            if(formulario.role || formulario.password){
                return res.send({message: "¡You can not update the role or password!"}); 
            }else{
                if(await userExist(formulario.username)){
                    return res.send({message: "This user name already exist."});
                }else{
                    const userUpdated = await User.findOneAndUpdate({_id: idUser}, formulario, {new: true});
                    return res.send({message: "¡User updated!", userUpdated});
                }
            }
        }else{
            return res.send({message: "¡You can not update this account!"});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
};

//AGREGAR UN USUARIO SIENTO ROLE ADMIN
exports.addUser = async (req, res) => {
    try {
        const formulario = req.body;
        const data = {
            name: formulario.name,
            surname: formulario.surname,
            username: formulario.username,
            password: await encrypt(formulario.password), //Jose Ruiz (ADMIN)- 123 VERIFICAR
            email: formulario.email,
            role: formulario.role
        };
        let msg = validateData(data);
        if(msg){
            return res.send(msg);
        }else{
            if(await userExist(formulario.username)){
                return res.send({message: "¡The user name already exist!"});
            }else{
                let usuario = new User(data);
                await usuario.save();
                return res.send({message: "¡User created!"});
            }
        }
    } catch (error) {
        console.log(error);
        return error;
    }
};

//ACTUALIZAR UN USUARIO SIENDO ROLE ADMIN **Nota** UN ADMIN NO PUEDE EDITAR OTROS ADMIN.
exports.manageUpdate = async (req, res) => {
    try {
        const idUser = req.params.id;
        const formulario = req.body;
        const user = await User.findOne({_id: idUser});
        if(user){
            if(user.role === "CLIENT"){
                if(await userExist(formulario.username)){
                    return res.send({message: "¡The user name already exist!"});
                }else{
                    const userUpdated = await User.findOneAndUpdate({_id: idUser}, formulario, {new: true});
                    return res.send({message: "¡User updated!", userUpdated});
                }
            }else{
                return res.send({message: "¡You can not update admins!"});
            }
        }else{
            return res.send({message: "User does not found."});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
};

//ELIMINAR UN USUARIO SIENDO ROLE ADMIN **Nota** UN ADMIN NO PUEDE ELIMINAR OTROS ADMIN.
exports.manageDelete = async (req, res) => {
    try {
        const idUser = req.params.id;
        const user = await User.findOne({_id: idUser});
        if(user){
            if(user.role === "CLIENT"){
                const userDeleted = await User.findOneAndDelete({_id: idUser});
                const shoppingCarDeleted = await ShoppingCar.findOneAndDelete({user: idUser});
                return res.send({message: "¡User deleted!", userDeleted});
            }else{
                return res.send({message: "¡You can not delete admins!"});
            }
        }else{
            return res.send({message: "User does not found."});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
};
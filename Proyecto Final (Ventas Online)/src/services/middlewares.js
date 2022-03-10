"use strict"
const jwt = require("jwt-simple");
const key = "key";

exports.verifyLogin = async (req, res, next) => {
    if(req.headers.authorization){
        let token = req.headers.authorization;
        try {
            let payload = await jwt.decode(token, key);
            req.user = payload;
            next();
        } catch (error) {
            console.log(error);
            return res.send({message: "The token is not valid."});
        }
    }else{
        return res.send({message: "The headers does not contain the token."});
    }
};

exports.isAdmin = (req, res, next) => {
    if(req.user.role === "ADMIN"){
        next();
    }else{
        return res.send({message: "¡You does not have permission to use this function!"});
    }
};
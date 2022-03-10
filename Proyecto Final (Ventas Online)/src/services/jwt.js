"use strict"
const jwt = require("jwt-simple");
const moment = require("moment");
const key = "key";

exports.createToken = async (user) => {
    try {
        let payload = {
            sub: user._id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
            role: user.role,
            iat: moment().unix(),
            exp: moment().add(2, "hours").unix()
        };
        return jwt.encode(payload, key);
    } catch (error) {
        console.log(error);
        return error;
    }
}
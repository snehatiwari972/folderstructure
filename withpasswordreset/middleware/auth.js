const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const SECRET_KEY = "NOTESAPI"


const auth = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (token) {
            token = token.split(" ")[1];
            let user = jwt.verify(token, SECRET_KEY); // yaha jwt.token token ko verify karega
            req.userId = user.id;
        }
        else {
           return res.status(401).json({ message: "Unauthorizes User" });
        }
        next(); // hamara work done ho gaya hai to next step ko execute karo
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ message: "Unauthorized user" });
    }
}





module.exports = auth;
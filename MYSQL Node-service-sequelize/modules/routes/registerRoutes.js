const express = require('express');
const app = express();
const registerRoute = express.Router();
const controller = require("../../modules/controller/register")

registerRoute.post("/signup",controller.signup);

registerRoute.post("/signin", controller.signin);
 
registerRoute.post("/forgetPassword",controller.forgotPassword);

registerRoute.put("/resetPassword",controller.resetPassword);

module.exports = registerRoute;
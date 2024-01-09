const express = require('express');
const userRouter = express.Router();
const controller = require("../controller/userController");
const multer = require("multer");
const upload = multer({ dest: 'upload/images/' });
const configureFileUpload = require("../Utils/file");



userRouter.post("/signup", configureFileUpload.upload.single('image'), controller.signup);

userRouter.post("/signin", controller.signin);
 
userRouter.post("/forgetPassword",controller.forgotPassword)
userRouter.put("/resetPassword",controller.resetPassword)

module.exports = userRouter;
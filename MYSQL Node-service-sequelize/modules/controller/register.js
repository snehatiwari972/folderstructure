// const con = require("../../config/connection");
const express = require('express');
const  validateData  = require("../model/validation");
const app = express();
const bcrypt = require("bcrypt");
const userService = require('../services')




const signup = async (req, res) => {
  try {
    const { error } = validateData.schema.validate(req.body); // Use validate here

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await userService.register(req.body);
    
    return res.status(201).json({ data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};




const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const loginResult = await userService.login(email, password);
    return res.status(loginResult.status).json({ ...loginResult });
  } catch (error) {
    console.error('Controller error:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};




const sendResetPasswordMail = async (email) => {
  try {
    if (!email) {
      return { message: 'Email is missing in the request body' };
    }

    const result = await userService.sendResetPasswordMailService(email);
    return { message: "OTP sent successfully" }; // You can return a custom success message here
  } catch (error) {
    console.error('Error sending reset password email:', error);
    return { message: 'Something went wrong' };
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body; // Assuming the email is directly in req.body
    if (!email) {
      throw new Error("An email is required.");
    }

    const createPasswordResetOTP = await sendResetPasswordMail(email);
    res.status(200).json(createPasswordResetOTP);
  } catch (error) {
    res.status(400).send(error.message);
  }
};




const resetPassword =  async (req, res, next) => {
  try {
    const { email, token, password } = req.body;

    const resetResult = await userService.resetPassword(email, token, password);

    if (resetResult.success) {
      return res.status(200).send(resetResult);
    } else {
      return res.status(400).send(resetResult);
    }
  } catch (error) {
    res.status(500).send({ success: false, msg: error.message });
  }
};









module.exports = { signup, signin, forgotPassword, sendResetPasswordMail, resetPassword };

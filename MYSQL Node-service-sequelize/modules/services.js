const Student = require("../modules/model/userModel");
const bcrypt = require("bcrypt");
const SECRET_KEY = "NOTESAPI";
const jwt = require("jsonwebtoken");
const {generateRandomOTP} = require("../Utils/otp");
const config = require("../modules/model/mail");
const nodemailer = require('nodemailer');
const express = require('express');
const app = express();



const register = async (body) => {
  const { username, password, email } = body;

  try {
    // Check if the user already exists
    const existingUser = await Student.findOne({
      where: { email: email }
    });

    if (existingUser) {
      return { message: 'User already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const newUser = await Student.create({ username, password: hashedPassword, email });
    return newUser.toJSON();
  } catch (error) {
    throw error;
  }
};



const login = async (email, password) => {
  try {
    const existingUser = await Student.findOne({ where: { email } });

    if (!existingUser) {
      return { status: 404, message: 'User Not Found' };
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return { status: 400, message: 'Invalid Credentials' };
    }

    const token = jwt.sign({ email: existingUser.email, id: existingUser.id }, 'your-secret-key'); // Replace 'your-secret-key' with your actual secret key
    return { status: 200, user: existingUser, token };
  } catch (error) {
    console.error('Login service error:', error);
    throw new Error('Something went wrong');
  }
};

 
const sendResetPasswordMailService = async (email) => {
  try {
    const existingUser = await Student.findOne({ where: { email } });

    if (!existingUser) {
      throw new Error("There's no account for the provided email");
    }

    const OTP = generateRandomOTP();
    const expirationDurationInMinutes = 5;
    const expirationTime = new Date(Date.now() + expirationDurationInMinutes * 60000);

    // Update the user's token field and reset password expiration time in the 'student' table
    await Student.update({ token: OTP }, { where: { email } });

    // Prepare and send OTP via email
    const otpDetails = {
      email,
      subject: "Password Reset",
      message: `Your OTP for password reset is: ${OTP}`,
      duration: expirationDurationInMinutes,
    };

    await config(email, "Password Reset", `Your OTP for password reset is: ${OTP}`, otpDetails);

    // Successful email sent
    console.log('OTP email sent successfully');

    return { message: "OTP sent successfully" };
  } catch (error) {
    throw error;
  }
};
  
  

const resetPassword = async (email, token, password) => {
  try {
    const user = await Student.findOne({ where: { email } });

    if (!user) {
      return { success: false, msg: "User not found." };
    }

    if (!token || !password) {
      return { success: false, msg: "Token and Password are required." };
    }

    if (token !== user.token) {
      return { success: false, msg: "Invalid token." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Student.update(
      { password: hashedPassword, token: '' },
      { where: { email } }
    );

    return { success: true, msg: "User password has been reset." };
  } catch (error) {
    throw new Error(error.message);
  }
};

  
  

module.exports = {
    register,
    login,
    sendResetPasswordMailService,
    resetPassword,
}



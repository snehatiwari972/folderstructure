require("../config/connection");
const { validateData } = require("../model/validation");
const userModel = require("../model/user");
const jwt =  require("jsonwebtoken");
const SECRET_KEY = "NOTESAPI";
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const config = require("../model/mail");
const randomatic = require("randomatic");




const generateRandomOTP = () => {
  // Generate a random 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000);
};

const sendResetPasswordMail = async (email) => {
  try {
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      throw new Error("There's no account for the provided email");
    }
    
    const OTP = generateRandomOTP();
    const expirationDurationInMinutes = 5; // Define the expiration duration in minutes

    // Calculate the expiration time based on the current time and the defined duration
    const expirationTime = new Date(Date.now() + expirationDurationInMinutes * 60000);

    // Update the user's token field and reset password expiration time in the database with the generated OTP and expiration time
    await userModel.findOneAndUpdate(
      { email: email },
      {
        $set: {
          token: OTP,
          resetPasswordExpires: expirationTime,
        },
      }
    );

    // Prepare and send OTP via email
    const otpDetails = {
      email,
      subject: "Password Reset",
      message: `Your OTP for password reset is: ${OTP}`,
      duration: expirationDurationInMinutes,
    };

    // Assuming the config function sends emails
    await config(email, "Password Reset", `Your OTP for password reset is: ${OTP}`);

    return { message: "OTP sent successfully" };
  } catch (error) {
    throw error;
  }
};




const signup = async (req, res) => {
  // console.log(req.body);
  const { username, password, email } = req.body;
  // if(!req.file && !req.file.filename)
  // {
  // }
  const image = req.file.filename;
  try {
    const { error, value } = validateData(req.body);
    // console.log(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const existingUser = await userModel.findOne({ email: value.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await userModel.create({
      username: username,
      password: hashedPassword,
      email: email,
      image: image //req.file.filename
    });

    res.status(201).json({ user: result });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something Went wrong" });
  }
};

const signin = async (req, res) =>{
  const {email, password} = req.body;
  try {
      const existingUser =await  userModel.findOne({email: email});
      if(!existingUser){
          return res.status(404).json({message: "User Not Found"});
      }
  
      const matchPassword = await bcrypt.compare(password, existingUser.password);
      if(!matchPassword)
      {
          return res.status(400).json({message: "Invalid Credentials"});
          
      }
  const token = jwt.sign({email : existingUser.email, id : existingUser._id}, SECRET_KEY);
  res.status(200).json({user: existingUser,token: token})
  
  
  }
  catch (error) {
      console.log(error);
      res.status(500).json({message: "Something Went wrong"});
    }  
  }


// Logic for forget password route or function
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body; // Assuming the email is directly in req.body
    if (!email) 
    {
      throw new Error("An email is required.");
    }
    

    const createPasswordResetOTP = await sendResetPasswordMail(email);
    res.status(200).json(createPasswordResetOTP);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, token, password } = req.body;
    
    // Find user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ success: false, msg: "User not found." });
    }

    // Check if the provided token matches the user's reset token and verify the password presence
    if (!token || !password) {
      return res.status(400).send({ success: false, msg: "Token and Password are required." });
    }

    // Verify if the user's stored reset token matches the token provided in the request
    if (token !== user.token) {
      return res.status(400).send({ success: false, msg: "Invalid token." });
    }

    // Check if the token has expired
    if (user.resetPasswordExpires && user.resetPasswordExpires < Date.now()) {
      return res.status(400).send({ success: false, msg: "Token has expired." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password and clear the token and expiry fields
    user.password = hashedPassword;
    user.token = '';
    user.resetPasswordExpires = undefined;
    
    await user.save();

    return res.status(200).send({
      success: true,
      msg: "User password has been reset.",
      data: user, // You may want to modify what user data is sent back
    });
  } catch (error) {
    res.status(500).send({ success: false, msg: error.message });
  }
};








module.exports = { signup, signin, forgotPassword, sendResetPasswordMail, resetPassword };
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const brypt = require("bcrypt");
const Doctor = require("../../models/doctorModel");
require("dotenv").config();
const {
  generateToken,
  verifyToken,
} = require("../../utils/tokens");
const { comparePassword } = require("../../utils/password");

async function doctorExist(req, res) {
    const { name } = req.params;
    const user = await Doctor.findOne({ name });
    try {
      if (user) {
        return res.status(409).json({
          success: false,
          message: "Username already exists",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Username is available",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
}


async function doctorSignUp(req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password,Speciality,gender,phone, fees } = req.body;
    try {
      
      let emailExist = await Doctor.findOne({ email });
      if (emailExist) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }
      let userExist = await Doctor.findOne({ name });
      if (userExist) {
        return res.status(409).json({
          success: false,
          message: "Username already exists",
        });
      }
  
     
  
      const user = new Doctor({ name, email, password,Speciality,gender,phone, fees});
      //save user to database
      await user.save();
  
      //send verification email
      const token = await generateToken(user._id);
  
      //logins user
      const accessToken = await generateToken(user._id);
  
      //status
      return res.status(201).json({
        success: true,
        message: "User created successfully",
        accessToken,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
}
async function doctorLogin(req, res) {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, password } = req.body;
  const user = await Doctor.findOne({ name });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Invalid credentials, check username or password",
    });
  }
  //compare password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials, check username or password",
    });
  }
  //generate token
  const accessToken = await generateToken(user._id);
  return res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken,
  });
}




module.exports = { doctorExist, doctorSignUp, doctorLogin};
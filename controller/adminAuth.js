const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Admin = require("../models/adminModel");
const brypt = require("bcrypt");
require("dotenv").config();
const { generateToken, verifyToken } = require("../utils/tokens");
const { comparePassword } = require("../utils/password");
async function userExist(req, res) {
  const { username } = req.params;
  const user = await Admin.findOne({ username });
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

/**
 * Creates a new user with the provided username, email, and password.
 * @async
 * @function signUp
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 * @throws {Error} - The error message.
 */

async function signUp(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, email, password } = req.body;
  try {
    let emailExist = await Admin.findOne({ email });
    if (emailExist) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }
    let userExist = await Admin.findOne({ username });
    if (userExist) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    const user = new Admin({ username, email, password });
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

/**
 * Logs in a user with the provided username and password.
 * @async
 * @function login
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 */

async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, password } = req.body;
  //check if user exists
  const user = await Admin.findOne({ username });
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

module.exports = {
  userExist,
  signUp,
  login,
};

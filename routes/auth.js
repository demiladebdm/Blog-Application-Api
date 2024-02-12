/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for user authentication
 */

const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const secret = process.env.SECRET;
const baseUrl = process.env.BASE_URL;
const node_email = process.env.NODE_MAIL;
const node_password = process.env.NODE_PASS;
const tokenExpiration = "1h";

//REGISTER METHOD
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with a unique username and email.
 *     tags: [Authentication]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User information for registration
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: User registration successful
 *       500:
 *         description: Internal Server Error
 */
router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    //Check if user already in db
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      throw new Error("User already registered");
    }

    //Creating a new user
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPass,
    });

    return res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

//LOGIN METHOD
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to the application
 *     description: Log in with a registered email and password.
 *     tags: [Authentication]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: credentials
 *         description: User credentials for login
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Wrong credentials
 *       500:
 *         description: Internal Server Error
 */
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email not found");
    }

    const validated = await bcrypt.compare(password, user.password);
    if (!validated) {
      throw new Error("Invalid email or password");
    }

    // Create and sign the JWT token
    jwt.sign({ email, id: user._id }, secret, {}, (err, token) => {
      if (err) {
        console.error("JWT signing error:", err);
        return res.status(500).json("Internal Server Error");
      }

      const { password, ...userWithoutPassword } = user._doc;

      res.status(200).json({
        token,
        user: userWithoutPassword,
      });
    });
  } catch (err) {
    next(err);
  }
});

// Forgot Password Route
/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Initiate password reset
 *     description: Initiates the process to reset the user's password by sending a password reset email.
 *     tags: [Authentication]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: email
 *         description: User's email address to initiate password reset.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Email not found
 *       500:
 *         description: Internal Server Error
 */
router.post("/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log("email", email);

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email not found");
    }
    console.log("user", user);

    const token = jwt.sign({ email }, secret, { expiresIn: tokenExpiration });
    console.log("token", token);

    // Send password reset email to user
    const transporter = nodemailer.createTransport({
      // Set up your nodemailer transporter configuration here
      service: "gmail",
      auth: {
        user: node_email,
        pass: node_password,
      },
    });

    console.log("transporter", transporter);
    // console.log("auth", auth);
    // console.log("user", user);
    // console.log("pass", pass);

    const mailOptions = {
      from: "danielmordi22@gmail.com",
      to: email,
      subject: "Password Reset",
      // text: `You are receiving this email because you requested a password reset. Click the following link to reset your password: ${baseUrl}/reset-password/${token}`,
      html: `You are receiving this email because you requested a password reset. Click the following link to reset your password: <a href="${baseUrl}/reset-password/${token}">Reset Password</a>`,
    };
    console.log("mailOptions", mailOptions);

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res.status(500).json("Error sending password reset email");
      }
      console.log("Email:", info);
      console.log("Email sent:", info.response);
      return res.status(200).json("Password reset email sent");
    });
  } catch (err) {
    console.error("next", err);
    next(err);
  }
});

// Reset Password Endpoint
/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Resets the user's password using the provided token and new password.
 *     tags: [Authentication]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: resetData
 *         description: Password reset data including token and new password.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid or expired token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.post("/reset-password", async (req, res, next) => {
  try {
    const { token, password } = req.body;

    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        console.error("Token verification failed:", err);
        return res.status(400).json("Invalid or expired token");
      }

      const { email } = decoded;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json("User not found");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);

      user.password = hashedPass;
      await user.save();

      return res.status(200).json("Password updated successfully");
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

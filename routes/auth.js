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
require("dotenv").config();

const secret = process.env.SECRET;

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
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPass,
    });

    res.status(200).json(newUser);
    // res.status(200).json(`User Created: ${newUser}`);
    // const user = await newUser.save();
    // res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ err: "Internal Server Error" });
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
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json("Wrong credentials!");
    }

    const validated = await bcrypt.compare(password, user.password);
    if (!validated) {
      return res.status(400).json("Wrong credentials!");
    }

    // Create and sign the JWT token
    jwt.sign({ email, id: user._id }, secret, {}, (err, token) => {
      if (err) {
        console.error("JWT signing error:", err);
        return res.status(500).json("Internal Server Error");
      }

      // Extracting properties to include in the response
      const { password, ...userWithoutPassword } = user._doc;

      // // Set the token in a cookie and send user data in the response
      // res
      //   .cookie("token", token)
      //   .status(200)
      //   .json({
      //     ...userWithoutPassword,
      //     id: user._id,
      //   });

      // Send user data along with the token in the response
      res.status(200).json({
        token,
        user: userWithoutPassword,
      });
    });

    // const { password, ...others } = user._doc;
    // res.status(200).json(others);
  } catch (err) {
    res.status(500).json({ err: "Internal Server Error" });
  }
});

module.exports = router;

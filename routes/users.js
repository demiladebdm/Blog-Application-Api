/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing user accounts
 */

const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middlewares/authMiddleware");

// Import the authMiddleware
router.use(authMiddleware);

// UPDATE USER
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user information
 *     description: Update user information such as username, email, and password.
 *     tags: [Users]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User ID
 *         required: true
 *       - in: body
 *         name: user
 *         description: User information for updating
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
 *         description: User update successful
 *       401:
 *         description: Unauthorized - You can update only your account
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id", async (req, res) => {
  if (req.user.id === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      console.log("Error:", err);
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("You can update only your account!");
  }
});

// DELETE USER
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user account
 *     description: Delete a user account and associated posts.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User ID
 *         required: true
 *     responses:
 *       200:
 *         description: User deletion successful
 *       401:
 *         description: Unauthorized - You can delete only your account
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", async (req, res) => {
  if (req.user.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      try {
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      res.status(404).json("User not found!");
    }
  } else {
    res.status(401).json("You can delete only your account!");
  }
});

// GET USER
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user information
 *     description: Retrieve user information by ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User ID
 *         required: true
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

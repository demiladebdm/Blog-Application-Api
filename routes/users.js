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
const authGuard = require("../middlewares/authMiddleware");

router.use(authGuard);

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
router.get("/:id", authGuard, async (req, res, next) => {
  try {
    const requestedUserId = req.params.id;

    try {
      let user = await User.findById(requestedUserId).select("-password");
      if (!user) {
        throw new Error("User not found");
      }
      return res.status(200).json(user);
    } catch (error) {
      throw new Error("Invalid user ID");
    }
  } catch (err) {
    next(err);
  }
});

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
router.put("/:id", authGuard, async (req, res, next) => {
  try {
    const requestedUserId = req.params.id;
    const authenticatedUserId = req.user._id;

    // Check if the authenticated user is the same as the requested user
    if (requestedUserId !== authenticatedUserId.toString()) {
      throw new Error("Unauthorized: You can only update your own profile");
    }

    let user = await User.findById(requestedUserId).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    if (req.body.password && req.body.password.length < 6) {
      throw new Error("Password length must be at least 6 characters");
    } else if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUserProfile = await user.save();

    res.status(200).json(updatedUserProfile);
  } catch (error) {
    next(error);
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

module.exports = router;

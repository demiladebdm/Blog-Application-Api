/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API endpoints for managing posts
 */

const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");
const authGuard = require("../middlewares/authMiddleware");

const User = require("../models/User");
const Category = require("../models/Category");
const Post = require("../models/Post");


// Applying authGuard middleware only to the routes where authentication is required
router.use(["/api/posts", "/api/posts/{id}"], authGuard);

//CREATE POST
/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     description: Create a new post with title, description, categories, and an attached photo.
 *     tags: [Posts]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: post
 *         description: The post data in JSON format
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               description: Title of the post
 *             desc:
 *               type: string
 *               description: Description of the post
 *             categories:
 *               type: array
 *               items:
 *                 type: string
 *               description: Categories associated with the post
 *             photo:
 *               type: string
 *               description: The photo URL or base64 encoded image data
 *             user:
 *               type: string
 *               description: Username of the author
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Post created successfully
 *               post:
 *                 _id: '1234567890abcdef12345678'
 *                 title: Example Post
 *                 desc: This is an example post.
 *                 categories: [Technology, AnotherCategory]
 *                 username: john_doe
 *                 photo: '/uploads/1234567890abcdef12345678.jpg'
 *                 createdAt: '2023-09-30T12:00:00.000Z'
 *                 updatedAt: '2023-09-30T12:00:00.000Z'
 *                 __v: 0
 *       500:
 *         description: Internal Server Error
 */
router.post("/", authGuard, async (req, res, next) => {
  try {
    const { title, desc, categories, photo, user } = req.body;

    // Validate if the required fields are present
    if (!title || !desc || !categories) {
      throw new Error("All required fields must be provided");
    }

    // Assuming categories is an array of strings (category names)
    const categoryIds = await Promise.all(
      categories.map(async (categoryName) => {
        // Check if the category already exists
        let category = await Category.findOne({ name: categoryName });

        // If it doesn't exist, create a new category
        if (!category) {
          category = await Category.create({ name: categoryName });
        }

        return category._id;
      })
    );

    // Convert user to ObjectId if it's not an empty string
    const userId = user ? mongoose.Types.ObjectId(user) : null;

    // Create a new post without token verification
    const newPost = await Post.create({
      title,
      desc,
      categories: categoryIds,
      photo,
      user: userId,
    });

    // Populate the categories in a separate query
    const populatedPost = await Post.findById(newPost._id).populate("categories");

    res.status(201).json(populatedPost);
  } catch (err) {
    next(err);
  }
});


//UPDATE POST
/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post
 *         schema:
 *           type: string
 *       - in: body
 *         name: post
 *         description: The updated post data in JSON format
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               description: Updated title of the post
 *             desc:
 *               type: string
 *               description: Updated description of the post
 *             categories:
 *               type: array
 *               items:
 *                 type: string
 *               description: Updated categories associated with the post
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               _id: '1234567890abcdef12345678'
 *               title: Updated Example Post
 *               desc: This is an updated example post.
 *               categories: [UpdatedTechnology, UpdatedAnotherCategory]
 *               username: john_doe
 *               photo: '/uploads/1234567890abcdef12345678.jpg'
 *               createdAt: '2023-09-30T12:00:00.000Z'
 *               updatedAt: '2023-09-30T12:00:00.000Z'
 *               __v: 0
 *       '500':
 *         description: Internal Server Error
 */
router.put("/:id", authGuard, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw new Error("Post not found");
    }

    if (post.username === req.body.username) {
      try {
        // Assuming categories is an array of strings (category names)
        const categoryIds = await Promise.all(
          req.body.categories.map(async (categoryName) => {
            // Check if the category already exists
            let category = await Category.findOne({ name: categoryName });

            // If it doesn't exist, create a new category
            if (!category) {
              category = await Category.create({ name: categoryName });
            }

            return category._id;
          })
        );

        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
            categories: categoryIds
          },
          { new: true }
        );

        if (!updatedPost) {
          throw new Error("Post not found");
        }

        // Populate the categories in a separate query
        const populatedUpdatedPost = await Post.findById(
          updatedPost._id
        ).populate("categories");

        res.status(200).json(populatedUpdatedPost);
      } catch (err) {
        console.log("ertr", err)
        throw new Error("Something went wrong");
      }
    } else {
      throw new Error("You can update only your post!");
    }
  } catch (err) {
    next(err);
  }
});

//DELETE POST
/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Post has been deleted...
 *       '500':
 *         description: Internal Server Error
 */
router.delete("/:id", authGuard, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.delete();
        res.status(200).json("Post has been deleted...");
      } catch (err) {
        throw new Error("Something went wrong");
      }
    } else {
      throw new Error("You can delete only your post!");
    }
  } catch (err) {
    next(err);
  }
});

//GET POST
/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               _id: 123
 *               title: Example Post
 *               content: This is an example post.
 */
router.get("/:id", async (req, res, next) => {
  try {
    const postId = req.params.id;

    // Validate if postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new Error("Invalid Post ID");
    }

    const post = await Post.findById(postId).populate("categories");

    if (!post) {
      throw new Error("Post not found");
    }

    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
});

//GET ALL POSTS
/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: user
 *         description: Username to filter posts
 *         schema:
 *           type: string
 *       - in: query
 *         name: cat
 *         description: Category name to filter posts
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *            example:
 *               - _id: 123
 *                 title: Example Post 1
 *                 content: This is the first example post.
 *                 categories:
 *                   - _id: 456
 *                     name: Category1
 *               - _id: 456
 *                 title: Example Post 2
 *                 content: This is the second example post.
 *                 categories:
 *                   - _id: 789
 *                     name: Category2
 */
router.get("/", async (req, res, next) => {
  let username = req.query.user;
  let catName = req.query.cat;
  try {
    let posts;

    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      // Decode the category name
      catName = decodeURIComponent(catName);
      const lowerCaseCatName = catName.toLowerCase();

      const category = await Category.findOne({ name: lowerCaseCatName });

      if (category) {
        // Log the posts directly to see what's being retrieved
        posts = await Post.find({ categories: category._id }).populate(
          "categories"
        );
      } else {
        // If the category doesn't exist, return an empty array
        posts = [];
      }
    } else {
      posts = await Post.find().populate("categories");
    }

    res.status(200).json(posts);
  } catch (err) {
    next(err)
  }
});

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API endpoints for managing posts
 */

const express = require("express");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const router = express.Router();
// const multer = require("multer");
// const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
// router.use("/uploads", express.static(__dirname + "/uploads"));

const User = require("../models/User");
const Post = require("../models/Post");

const secret = process.env.SECRET;

// Configure Cloudinary with your cloud credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// //CREATE POST
// router.post("/", async (req, res) => {
//   // console.log("request", req);
//   // console.log("requ", req);
//   // const { originalname, path } = req.file;
//   // const parts = originalname.split(".");
//   // const ext = parts[parts.length - 1];
//   // const newPath = path + "." + ext;
//   // fs.renameSync(path, newPath);

//   // console.log("Request:", req);
//   // console.log("Uploaded File:", req.file);
//   // res.status(500).json({ originalname: originalname, newPath });

//   // const newPost = new Post(req.body);
//   // const { title, summary, content } = req.body;
//   // const newPost = await Post.create({
//   //   title,
//   //   // summary,
//   //   desc,
//   //   // photo,
//   //   // username,
//   //   categories,
//   //   photo,
//   //   username: info.id,
//   // });

//   // try {
//   //   // const savedPost = await newPost.save();
//   //   const newPost = await Post.create({
//   //     title,
//   //     desc,
//   //     categories,
//   //     photo: req.file.filename,
//   //     username: info.id,
//   //   });
//   //   res.status(200).json(newPost);
//   // } catch (err) {
//   //   console.error(err);
//   //   res.status(500).json({ err: "Internal Server Error" });
//   // }

//   try {
//     // Your file upload logic here...
//     // console.log("request", req);
//     // console.log("requ", req.file);
//     // const { originalname, path } = req.file;
//     // const parts = originalname.split(".");
//     // const ext = parts[parts.length - 1];
//     // const newPath = path + "." + ext;
//     // fs.renameSync(path, newPath);

//     const { title, desc, categories, username } = req.body;
//     const newPost = await Post.create({
//       title,
//       desc,
//       categories,
//       photo,
//       username,
//       // photo: req.file.filename,
//       // username: info.id, // Assuming 'info' contains the user ID.
//     });

//     res.status(200).json(newPost);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ err: "Internal Server Error" });
//   }
// });

// //CREATE POST
// router.post("/", async (req, res) => {
//   try {
//     // Your file upload logic here...
//     // console.log("request", req);
//     // console.log("requ", req.file);
//     // const { originalname, path } = req.file;
//     // const parts = originalname.split(".");
//     // const ext = parts[parts.length - 1];
//     // const newPath = path + "." + ext;
//     // fs.renameSync(path, newPath);

//     const { title, desc, categories, username, photo } = req.body;
//     console.log("body", req.body)
//     const newPost = await Post.create({
//       title,
//       desc,
//       categories,
//       photo,
//       username,
//       // photo: req.file.filename,
//       // username: info.id, // Assuming 'info' contains the user ID.
//     });

//     console.log("post-body", newPost);
//     res.status(200).json(newPost);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ err: "Internal Server Error" });
//   }
// });

//CREATE POST
/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     description: Create a new post with title, description, categories, and an attached photo.
 *     tags: [Posts]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         description: The photo file to be uploaded
 *         required: true
 *       - in: formData
 *         name: title
 *         type: string
 *         description: Title of the post
 *         required: true
 *       - in: formData
 *         name: desc
 *         type: string
 *         description: Description of the post
 *         required: true
 *       - in: formData
 *         name: categories
 *         type: string
 *         description: Categories associated with the post
 *         required: true
 *       - in: formData
 *         name: username
 *         type: string
 *         description: Username of the author
 *         required: true
 *     responses:
 *       200:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Post created successfully
 *               post:
 *                 _id: '1234567890abcdef12345678'
 *                 title: Example Post
 *                 desc: This is an example post.
 *                 categories: Technology
 *                 username: john_doe
 *                 photo: '/uploads/1234567890abcdef12345678.jpg'
 *                 createdAt: '2023-09-30T12:00:00.000Z'
 *                 updatedAt: '2023-09-30T12:00:00.000Z'
 *                 __v: 0
 *       500:
 *         description: Internal Server Error
 */
// router.post("/", uploadMiddleware.single("file"), async (req, res) => {
//   // const { originalname, path } = req.file;
//   // console.log("file", req.file);
//   // const parts = originalname.split(".");
//   // const ext = parts[parts.length - 1];
//   // const newPath = path + "." + ext;
//   // fs.renameSync(path, newPath);

//   const { token } = req.cookies;
//   console.log("cookie", req.cookies);

//   jwt.verify(token, secret, {}, async (err, info) => {
//     console.log("info", info);

//     if (err) throw err;

//     // // Upload image to Cloudinary
//     // const cloudinaryResponse = await cloudinary.uploader.upload(newPath);

//     const { title, desc, categories, username, photo } = req.body;
//     console.log("doc", req.body);
//     const postDoc = await Post.create({
//       title,
//       desc,
//       categories,
//       photo,
//       author: info.id,
//     });
//     res.json(postDoc);
//   });
//   // try {
//   //   // Your file upload logic here...
//   //   // console.log("request", req);
//   //   // console.log("requ", req.file);
//   //   // const { originalname, path } = req.file;
//   //   // const parts = originalname.split(".");
//   //   // const ext = parts[parts.length - 1];
//   //   // const newPath = path + "." + ext;
//   //   // fs.renameSync(path, newPath);

//   //   const { title, desc, categories, username, photo } = req.body;
//   //   console.log("body", req.body)
//   //   const newPost = await Post.create({
//   //     title,
//   //     desc,
//   //     categories,
//   //     photo,
//   //     username,
//   //     // photo: req.file.filename,
//   //     // username: info.id, // Assuming 'info' contains the user ID.
//   //   });

//   //   console.log("post-body", newPost);
//   //   res.status(200).json(newPost);
//   // } catch (err) {
//   //   console.error(err);
//   //   res.status(500).json({ err: "Internal Server Error" });
//   // }
// });
router.post("/", async (req, res) => {
  try {
    const { title, desc, categories, photo } = req.body;

    // Create a new post without token verification
    const newPost = await Post.create({
      title,
      desc,
      categories,
      photo,
    });

    res.status(201).json(newPost);
  } catch (err) {
    let errorMessage = err.message || "Internal Server Error";

    res.status(500).json({ err: errorMessage });
  }
});

// //CREATE POST
// router.post("/", uploadMiddleware.single("file"), async (req, res) => {
//   // const { originalname, path } = req.file;
//   // const parts = originalname.split(".");
//   // const ext = parts[parts.length - 1];
//   // const newPath = path + "." + ext;
//   // fs.renameSync(path, newPath);

//   // if (err) throw err;
//   const { title, desc, categories, photo, username } = req.body;
//   const postDoc = await Post.create({
//     title,
//     desc,
//     categories,
//     photo,
//     username,
//   });
//   res.json(postDoc);

//   // const { token } = req.cookies;
//   // jwt.verify(token, secret, {}, async (err, info) => {
//   //   if (err) throw err;
//   //   const { title, desc, categories, photo, username } = req.body;
//   //   const postDoc = await Post.create({
//   //     title,
//   //     desc,
//   //     categories,
//   //     photo: req.file.filename,
//   //     username: info.id,
//   //   });
//   //   res.json(postDoc);
//   // });
// });

//UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.delete();
        res.status(200).json("Post has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET POST
/**
 * @swagger
 * /posts/{id}:
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
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
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
 *             example:
 *               - _id: 123
 *                 title: Example Post 1
 *                 content: This is the first example post.
 *               - _id: 456
 *                 title: Example Post 2
 *                 content: This is the second example post.
 */

router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    // console.log("posts", posts);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

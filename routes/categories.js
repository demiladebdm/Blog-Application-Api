/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API endpoints for managing categories
 */

const router = require("express").Router();
const Category = require("../models/Category");

// CREATE CATEGORY
/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     description: Create a new category with a unique name.
 *     tags: [Categories]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: category
 *         description: Category information for creation
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *     responses:
 *       200:
 *         description: Category creation successful
 *       500:
 *         description: Internal Server Error
 */
router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const newCat = await Category.create({ name });
    res.status(200).json(newCat);
  } catch (err) {
    res.status(500).json({ err: "Internal Server Error" });
  }
});

// GET CATEGORIES
/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve a list of all categories.
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
  try {
    const cats = await Category.find();
    res.status(200).json(cats);
  } catch (err) {
    res.status(500).json({ err: "Internal Server Error" });
  }
});

module.exports = router;

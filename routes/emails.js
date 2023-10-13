/**
 * @swagger
 * tags:
 *   name: Emails
 *   description: API endpoints for managing Emails
 */

const router = require("express").Router();
const Email = require("../models/Email");

// CREATE EMAIL
/**
 * @swagger
 * /api/emails:
 *   post:
 *     summary: Subscribe with an email
 *     description: Subscribe with an email.
 *     tags: [Emails]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: email
 *         description: Email information for creation
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *     responses:
 *       200:
 *         description: Email creation successful
 *       500:
 *         description: Internal Server Error
 */
router.post("/", async (req, res) => {
  const { email } = req.body;
  try {
    const newEmail = await Email.create({ email });
    res.status(200).json(newEmail);
  } catch (err) {
    res.status(500).json({ err: "Internal Server Error" });
  }
});

// GET EMAILS
/**
 * @swagger
 * /api/emails:
 *   get:
 *     summary: Get all emails
 *     description: Retrieve a list of all emails.
 *     tags: [Emails]
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
  try {
    const emails = await Email.find();
    res.status(200).json(emails);
  } catch (err) {
    res.status(500).json({ err: "Internal Server Error" });
  }
});

module.exports = router;

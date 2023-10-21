/**
 * @swagger
 * tags:
 *   name: Contactus
 *   description: API endpoints for managing ContactUs submissions
 */

const router = require("express").Router();
const Contactus = require("../models/Contactus");

// CREATE CONTACT
/**
 * @swagger
 * /api/contactus:
 *   post:
 *     summary: Submit a contact form
 *     description: Submit a contact form with user information.
 *     tags: [Contactus]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: contactus
 *         description: ContactUs information for submission
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             email:
 *               type: string
 *             phoneNumber:
 *               type: string
 *             message:
 *               type: string
 *     responses:
 *       200:
 *         description: ContactUs submission successful
 *       500:
 *         description: Internal Server Error
 */
router.post("/", async (req, res) => {
  const { firstName, lastName, email, phoneNumber, message } = req.body;
  try {
    const newContactUs = await Contactus.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      message,
    });
    res.status(200).json(newContactUs);
  } catch (err) {
    res.status(500).json({ err: "Internal Server Error" });
  }
});

// GET CONTACTUS SUBMISSIONS
/**
 * @swagger
 * /api/contactus:
 *   get:
 *     summary: Get all contact form submissions
 *     description: Retrieve a list of all contact form submissions.
 *     tags: [Contactus]
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
  try {
    const contactUsSubmissions = await Contactus.find();
    res.status(200).json(contactUsSubmissions);
  } catch (err) {
    res.status(500).json({ err: "Internal Server Error" });
  }
});


module.exports = router;

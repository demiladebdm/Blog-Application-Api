const express = require("express");
const router = express.Router();

// Import your model
const Habari = require("../models/Habari");

/**
 * @swagger
 * /api/habari:
 *   post:
 *     summary: Process Habari data
 *     description: Process Habari data with the specified properties and return random text
 *     tags: [Habari]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: habari
 *         description: The Habari data in JSON format
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             transactionid:
 *               type: string
 *             terminalid:
 *               type: string
 *             merchantid:
 *               type: string
 *             merchantname:
 *               type: string
 *             pan:
 *               type: string
 *             tokentype:
 *               type: string
 *       - in: header
 *         name: Sender
 *         description: The Sender header with value 100010
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           text/plain:
 *             example: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               message: "Sender header is required and cannot be empty"
 *       500:
 *         description: Internal Server Error
 */
router.post("/", async (req, res, next) => {
  try {
    const {
      transactionid,
      terminalid,
      merchantid,
      merchantname,
      pan,
      tokentype,
    } = req.body;

    // Validate if the required fields are present
    if (
      !transactionid ||
      !terminalid ||
      !merchantid ||
      !merchantname ||
      !pan ||
      !tokentype
    ) {
      throw new Error("All required fields must be provided");
    }

    // Access the Sender header
    const senderHeader = req.headers.sender;

    // Check if the Sender header is missing or empty
    if (!senderHeader || senderHeader.trim() === "") {
      return res.status(500).json({
        message: "Sender header is required and cannot be empty",
      });
    }

    // Check if the Sender header has the expected value
    if (senderHeader !== "100010") {
      return res.status(400).json({ message: "Invalid Sender header value" });
    }

    // Save the Habari data to MongoDB (optional, based on your use case)
    const savedHabari = await Habari.create(req.body);

    // Generate random text (simple approach)
    const randomText = generateRandomText();

    // Send plain text as the response
    res.status(200).send(randomText);
  } catch (err) {
    next(err);
  }
});

// Function to generate a random text
function generateRandomText() {
  const possibleTexts = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    // Add more possible texts as needed
  ];

  // Pick a random text from the array
  const randomIndex = Math.floor(Math.random() * possibleTexts.length);
  return possibleTexts[randomIndex];
}

/**
 * @swagger
 * /api/habari:
 *   get:
 *     summary: Get all Habari data
 *     description: Retrieve all Habari data stored in the system.
 *     tags: [Habari]
 *     parameters:
 *       - in: header
 *         name: Sender
 *         description: The Sender header with value 100010
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - transactionid: "12345"
 *                 terminalid: "67890"
 *                 merchantid: "ABCDE"
 *                 merchantname: "Example Merchant"
 *                 pan: "1234567890123456"
 *                 tokentype: "example"
 *                 createdAt: "2023-10-20T12:00:00.000Z"
 *                 updatedAt: "2023-10-20T12:00:00.000Z"
 *               - transactionid: "67890"
 *                 terminalid: "54321"
 *                 merchantid: "FGHIJ"
 *                 merchantname: "Another Merchant"
 *                 pan: "9876543210987654"
 *                 tokentype: "another_example"
 *                 createdAt: "2023-10-21T12:00:00.000Z"
 *                 updatedAt: "2023-10-21T12:00:00.000Z"
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res, next) => {
  try {
    // Access the Sender header
    const senderHeader = req.headers.sender;

    // Check if the Sender header is missing
    if (!senderHeader) {
      return res.status(500).json({ message: "Sender header is required" });
    }

    // Check if the Sender header has the expected value
    if (senderHeader !== "100010") {
      return res.status(400).json({ message: "Invalid Sender header value" });
    }

    const habariData = await Habari.find();
    res.status(200).json(habariData);
  } catch (err) {
    next(err);
  }
});


module.exports = router;
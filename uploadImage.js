const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with your cloud credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Upload image to Cloudinary
const cloudinaryResponse = await cloudinary.uploader.upload(newPath);
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const dontenv = require("dotenv");
const mongoose = require("mongoose");
// const multer = require("multer");
const cors = require("cors");
const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swaggerDocs");
const fs = require("fs");

dontenv.config();

mongoose
.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => console.log(err));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// mongoose.connect(
  //   "mongodb+srv://demiladebdm:YDc0LmbapHaxHAX4@cluster0.8atwsuq.mongodb.net/?retryWrites=true&w=majority"
// );

// Swagger setup
const specs = swaggerJsdoc(swaggerDocs);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));


app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
// app.use("/images", express.static(path.join(__dirname, "/images")));


// const upload = multer({ dest: "uploads/" });
// const upload = multer({ storage: storage });
// app.post("/api/upload", upload.single("file"), (req, res) => {
//   res.status(200).json("File has been uploaded");
// });


const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const emailRoute = require("./routes/emails");


app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/emails", emailRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

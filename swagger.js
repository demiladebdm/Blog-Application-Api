// swagger.js
const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./swaggerOptions");

const specs = swaggerJsdoc(swaggerOptions);

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Your routes go here

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

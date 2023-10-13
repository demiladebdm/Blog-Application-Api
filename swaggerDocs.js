// swaggerDocs.js
module.exports = {
  swaggerDefinition: {
    info: {
      title: "Blog Website",
      version: "v1",
      description: "Blog Website API",
      contact: {
        name: "Demilade Folarin",
        email: "demiladefolarin@gmail.com",
        url: "https://www.google.com",
      },
    },
    externalDocs: {
      url: "/swagger/v1/swagger.json", // Link to export the API as JSON
      description: "Export the API definition as a JSON file",
    },
    securityDefinitions: {
      Bearer: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        description: "Token format: Bearer YOUR_TOKEN",
      },
    },
    security: [
      {
        Bearer: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the API routes folder
  customCss: `
    .swagger-ui .topbar {
      flex-wrap: wrap;
    }

    .swagger-ui .info {
      margin-top: 20px;
      margin-bottom: 10px;
    }

    .swagger-ui .info .title {
      margin-bottom: 0;
    }

    .swagger-ui .info .external-docs {
      margin-top: 10px;
      color: green; /* Change color to green */
    }

    .swagger-ui .info .description,
    .swagger-ui .info .contact {
      margin-top: 10px;
    }
  `,
};



// const jwt = require("jsonwebtoken");
// const secret = process.env.SECRET;

// const authMiddleware = (req, res, next) => {
//   const authHeader = req.header("Authorization");

//   if (!authHeader || typeof authHeader !== "string") {
//     return res.status(401).json({ error: "Unauthorized: No token provided" });
//   }

//   const token = authHeader.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ error: "Unauthorized: No token provided" });
//   }

//   jwt.verify(token, secret, (err, user) => {
//     if (err) {
//       return res.status(403).json({ error: "Forbidden: Invalid token" });
//     }

//     req.user = user;
//     next();
//   });
// };

// module.exports = authMiddleware;


// authMiddleware.js

// const jwt = require('jsonwebtoken');
// const secret = process.env.SECRET;

// function authenticateToken(req, res, next) {
//   const token = req.header('Authorization');

//   if (!token) return res.status(401).json({ message: 'Unauthorized' });

//   jwt.verify(token, secret, (err, user) => {
//     if (err) return res.status(403).json({ message: 'Forbidden' });

//     req.user = user;
//     next();
//   });
// }

// module.exports = authenticateToken;

// authMiddleware.js

const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

function authenticateToken(req, res, next) {
  const token = req.header("Authorization").split(" ")[1];

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.log("Token expired");
        return res.status(403).json({ message: "Token expired" });
      } else {
        console.log("Token verification error:", err);
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;

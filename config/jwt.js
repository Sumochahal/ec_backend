const jwt = require("jsonwebtoken");

exports.generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
// ...existing code...
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const SECRET = process.env.JWT_SECRET;
// if (!SECRET) {
//   throw new Error("JWT_SECRET environment variable is not set");
// }

// exports.generateToken = (payload) => {
//   return jwt.sign(payload, SECRET, {
//     expiresIn: "7d",
//   });
// };

// exports.verifyToken = (token) => {
//   return jwt.verify(token, SECRET);
// };
// ...existing code...

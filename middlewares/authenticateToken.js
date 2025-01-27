const e = require("express");
const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }
    req.username = decoded.email;
    req.id_user = decoded.id;
    req.email = decoded.email;

    next();
  });
};

module.exports = authenticateToken;

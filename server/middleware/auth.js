// middleware/auth.js
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for Bearer token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user id to request object
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Token is not valid" });
  }
};

module.exports = auth;

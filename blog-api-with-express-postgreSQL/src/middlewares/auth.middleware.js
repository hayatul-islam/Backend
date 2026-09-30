const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/response");

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return sendResponse(res, 401, false, "Authentication required");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return sendResponse(res, 401, false, "Invalid authorization format");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return sendResponse(res, 401, false, "Invalid or expired token");
  }
};

module.exports = authenticate;

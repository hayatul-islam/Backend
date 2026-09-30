const sendResponse = require("../utils/response");

const notFound = (req, res, next) => {
  sendResponse(
    res,
    404,
    false,
    `Route not found: ${req.method} ${req.originalUrl}`,
  );
};

module.exports = notFound;

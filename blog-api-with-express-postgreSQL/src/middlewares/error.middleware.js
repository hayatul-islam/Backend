const sendResponse = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // PostgreSQL unique violation
  if (err.code === "23505") {
    let msg = "Duplicate value already exists";

    if (err.constraint === "email") {
      msg = "Email already exists";
    }

    return sendResponse(res, 409, false, msg);
  }

  return sendResponse(res, 500, false, "Internal server error");
};

module.exports = errorHandler;

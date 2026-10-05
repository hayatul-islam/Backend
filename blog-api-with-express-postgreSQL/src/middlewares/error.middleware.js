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

  // PostgreSQL foreign key violation
  if (err.code === "23503") {
    return sendResponse(res, 400, false, "Referenced resource does not exist");
  }

  // PostgreSQL invalid input syntax
  if (err.code === "22P02") {
    return sendResponse(res, 400, false, "Invalid input value");
  }

  // PostgreSQL NOT NULL violation
  if (err.code === "23502") {
    return sendResponse(res, 400, false, "Required field is missing");
  }

  // Unknown error
  return sendResponse(res, 500, false, "Internal server error");
};

module.exports = errorHandler;

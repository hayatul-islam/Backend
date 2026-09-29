const { sendResponse } = require("../utils/response");

function validateCreateUser(req, res, next) {
  const { name, email, age } = req.body;
  const errors = {};

  if (typeof name !== "string" || name.trim().length < 2) {
    errors.name = "Name is required and must be at least 2 characters";
  }

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "A valid email is required";
  }

  if (
    typeof age !== "number" ||
    !Number.isInteger(age) ||
    age < 1 ||
    age > 120
  ) {
    errors.age = "Age must be an integer between 1 and 120";
  }

  if (Object.keys(errors).length > 0) {
    return sendResponse(res, 400, false, "Validation failed", errors);
  }

  next();
}

function validateUser(req, res, next) {
  const { name, email, age } = req.body;
  const errors = {};

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
  }

  if (email !== undefined) {
    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      errors.email = "A valid email is required";
    }
  }

  if (age !== undefined) {
    if (
      typeof age !== "number" ||
      !Number.isInteger(age) ||
      age < 1 ||
      age > 120
    ) {
      errors.age = "Age must be an integer between 1 and 120";
    }
  }

  if (Object.keys(errors).length > 0) {
    return sendResponse(res, 400, false, "Validation failed", errors);
  }

  next();
}

module.exports = { validateUser, validateCreateUser };

const sendResponse = require("../utils/response");

const validateCreateUser = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return sendResponse(
      res,
      400,
      false,
      "Name, email and password are required",
    );
  }

  if (name.trim().length < 2) {
    return sendResponse(res, 400, false, "Name must be at least 2 characters");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return sendResponse(res, 400, false, "Please provide a valid email");
  }

  if (password.length < 6) {
    return sendResponse(
      res,
      400,
      false,
      "Password must be at least 6 characters",
    );
  }

  next();
};

module.exports = validateCreateUser;

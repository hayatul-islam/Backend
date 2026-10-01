const sendResponse = require("../utils/response");

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendResponse(res, 401, false, "Authentication required");
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendResponse(
        res,
        403,
        false,
        "You do not have permission to perform this action",
      );
    }

    next();
  };
};

module.exports = authorize;

const sendResponse = require("../utils/response");

const validateCreateComment = (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return sendResponse(
      res,
      400,
      false,
      "Comment content is required"
    );
  }

  if (content.trim().length < 2) {
    return sendResponse(
      res,
      400,
      false,
      "Comment must be at least 2 characters"
    );
  }

  next();
};

const validateUpdateComment = (req, res, next) => {
  const { content } = req.body;

  if (content === undefined) {
    return sendResponse(
      res,
      400,
      false,
      "Comment content is required"
    );
  }

  if (content.trim().length < 2) {
    return sendResponse(
      res,
      400,
      false,
      "Comment must be at least 2 characters"
    );
  }

  next();
};

module.exports = {
  validateCreateComment,
  validateUpdateComment,
};
const sendResponse = require("../utils/response");

const validateCreatePost = (req, res, next) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return sendResponse(res, 400, false, "Title and content are required");
  }

  if (title.trim().length < 3) {
    return sendResponse(res, 400, false, "Title must be at least 3 characters");
  }

  if (content.trim().length < 10) {
    return sendResponse(
      res,
      400,
      false,
      "Content must be at least 10 characters",
    );
  }

  next();
};

const validateUpdatePost = (req, res, next) => {
  const { title, content, category_id } = req.body;

  if (
    title === undefined &&
    content === undefined &&
    category_id === undefined
  ) {
    return sendResponse(res, 400, false, "At least one field is required");
  }

  if (title !== undefined && title.trim().length < 3) {
    return sendResponse(res, 400, false, "Title must be at least 3 characters");
  }

  if (content !== undefined && content.trim().length < 10) {
    return sendResponse(
      res,
      400,
      false,
      "Content must be at least 10 characters",
    );
  }

  next();
};

module.exports = {
  validateCreatePost,
  validateUpdatePost,
};

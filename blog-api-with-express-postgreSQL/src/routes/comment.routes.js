const express = require("express");

const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} = require("../controllers/comment.controller");

const authenticate = require("../middlewares/auth.middleware");
const {
  validateCreateComment,
  validateUpdateComment,
} = require("../middlewares/comment.validation.middleware");

const router = express.Router();

router.post(
  "/posts/:postId/comments",
  authenticate,
  validateCreateComment,
  createComment,
);
router.get("/posts/:postId/comments", getComments);
router.put("/comments/:id", authenticate, validateUpdateComment, updateComment);
router.delete("/comments/:id", authenticate, deleteComment);

module.exports = router;

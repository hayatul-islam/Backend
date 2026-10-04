const express = require("express");
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");
const authenticate = require("../middlewares/auth.middleware");
const {
  validateCreatePost,
  validateUpdatePost,
} = require("../middlewares/post.validation.middleware");

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);

router.post("/", authenticate, validateCreatePost, createPost);
router.put("/:id", authenticate, validateUpdatePost, updatePost);
router.delete("/:id", authenticate, deletePost);

module.exports = router;

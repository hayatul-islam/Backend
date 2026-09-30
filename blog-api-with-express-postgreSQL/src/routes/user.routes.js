const express = require("express");
const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
  getProfile,
} = require("../controllers/user.controller");
const validationCreateUser = require("../middlewares/user.validation.middleware");
const authenticate = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/profile", authenticate, getProfile);
router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", validationCreateUser, createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/login", loginUser);

module.exports = router;

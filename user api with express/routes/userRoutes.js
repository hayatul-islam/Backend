const express = require("express");
const fs = require("fs");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userControllers");
const {
  validateUser,
  validateCreateUser,
} = require("../middleware/validateUser");

const router = express.Router();

router.get("/", asyncHandler(getUsers));
router.get("/:id", asyncHandler(getUser));
router.post("/", validateCreateUser, asyncHandler(createUser));
router.put("/:id", validateUser, asyncHandler(updateUser));
router.delete("/:id", asyncHandler(deleteUser));

module.exports = router;

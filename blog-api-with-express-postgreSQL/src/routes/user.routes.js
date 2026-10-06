const express = require("express");
const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
  getProfile,
  refreshAccessToken,
  logoutUser,
  updateUserRole,
  uploadProfileImage,
} = require("../controllers/user.controller");
const validationCreateUser = require("../middlewares/user.validation.middleware");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const upload = require("../config/multer");

const router = express.Router();

// Public
router.post("/", validationCreateUser, createUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);

// Authenticated
router.post("/logout", authenticate, logoutUser);
router.get("/profile", authenticate, getProfile);
router.post(
  "/profile-image",
  authenticate,
  upload.single("image"),
  uploadProfileImage,
);

// Admin only
router.get("/", authenticate, authorize("admin"), getUsers);
router.put("/:id", authenticate, authorize("admin"), updateUser);
router.patch("/:id/role", authenticate, authorize("admin"), updateUserRole);
router.delete("/:id", authenticate, authorize("admin"), deleteUser);

// Authenticated user
router.get("/:id", authenticate, getUser);

module.exports = router;

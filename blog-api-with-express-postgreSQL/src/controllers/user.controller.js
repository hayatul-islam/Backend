const userModel = require("../models/user.model");
const sendResponse = require("../utils/response");
const bcrypt = require("bcrypt");
const refreshTokenModel = require("../models/refreshToken.model");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const getUsers = async (req, res, next) => {
  try {
    const users = await userModel.getAllUsers();

    sendResponse(res, 200, true, "Users fetched successfully", users);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userModel.getUserById(id);
    if (!user) {
      sendResponse(res, 404, false, "User not found");
    }
    sendResponse(res, 200, true, "User fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await userModel.createUser({ name, email, password });
    sendResponse(res, 201, true, "User created successfully", user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = await userModel.updateUser(id, {
      name,
      email,
      password,
    });

    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    sendResponse(res, 200, true, "User updated successfully", user);
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return sendResponse(res, 400, false, "Invalid role");
    }

    const user = await userModel.updateUserRole(id, role);

    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    return sendResponse(res, 200, true, "User role updated successfully", user);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await userModel.deleteUser(id);
    if (!user) {
      sendResponse(res, 404, false, "User not found");
    }
    sendResponse(res, 200, true, "User deleted successfully", user);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.getUserByEmail(email);

    if (!user) {
      return sendResponse(res, 401, false, "Invalid email or password");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return sendResponse(res, 401, false, "Invalid email or password");
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Refresh token expiry: 7 days
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Save refresh token in database
    await refreshTokenModel.createRefreshToken({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    sendResponse(res, 200, true, "Login successful", {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await userModel.getUserById(req.user.id);

    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    sendResponse(res, 200, true, "Profile fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendResponse(res, 401, false, "Refresh token is required");
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Check token in database
    const storedToken = await refreshTokenModel.getRefreshToken(refreshToken);

    if (!storedToken) {
      return sendResponse(res, 401, false, "Invalid refresh token");
    }

    // Check expiration
    if (new Date(storedToken.expires_at) < new Date()) {
      return sendResponse(res, 401, false, "Refresh token expired");
    }

    // Get user
    const user = await userModel.getUserById(decoded.id);

    if (!user) {
      return sendResponse(res, 401, false, "User not found");
    }

    // Generate new access token
    const accessToken = generateAccessToken(user);

    return sendResponse(res, 200, true, "Access token refreshed successfully", {
      accessToken,
    });
  } catch (error) {
    return sendResponse(res, 401, false, "Invalid or expired refresh token");
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendResponse(res, 400, false, "Refresh token is required");
    }

    const deletedToken =
      await refreshTokenModel.deleteRefreshToken(refreshToken);

    if (!deletedToken) {
      return sendResponse(res, 404, false, "Refresh token not found");
    }

    return sendResponse(res, 200, true, "Logout successful");
  } catch (error) {
    next(error);
  }
};

const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendResponse(res, 400, false, "Profile image is required");
    }

    const user = await userModel.getUserById(req.user.id);

    if (user.image) {
      const relativePath = user.image.replace(/^\/+/, "");

      const oldImagePath = path.join(process.cwd(), relativePath);

      if (fs.existsSync(oldImagePath)) {
        await fs.promises.unlink(oldImagePath);
      }
    }

    const imagePath = `/uploads/profiles/${req.file.filename}`;

    const updatedUser = await userModel.updateProfileImage(
      req.user.id,
      imagePath,
    );

    return sendResponse(
      res,
      200,
      true,
      "Profile image uploaded successfully",
      updatedUser,
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getProfile,
  refreshAccessToken,
  logoutUser,
  updateUserRole,
  uploadProfileImage,
};

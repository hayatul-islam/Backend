const userModel = require("../models/user.model");
const sendResponse = require("../utils/response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    console.log(user);
    if (!user) {
      sendResponse(res, 401, false, "Invalid email or password");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      sendResponse(res, 401, false, "Invalid email or password");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    sendResponse(res, 200, true, "Login successfully", {
      user: { id: user.id, name: user.name, email: user.email },
      token: token,
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

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getProfile,
};

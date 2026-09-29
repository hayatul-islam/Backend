const fs = require("fs/promises");
const path = require("path");

const { sendResponse } = require("../utils/response");

const usersFile = path.join(process.cwd(), "data", "users.json");

const getUsers = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const data = await fs.readFile(usersFile, "utf-8");
  const users = JSON.parse(data);

  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIdx = (page - 1) * limit;
  const endIdx = startIdx + limit;

  const paginateUsers = users.slice(startIdx, endIdx);

  sendResponse(res, 200, true, "Users fetched successfully", {
    pagination: { page, limit, totalPages, totalItems },
    users: paginateUsers,
  });
};

const getUser = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    sendResponse(res, 400, false, "Invalid user id");
  }
  const data = await fs.readFile(usersFile, "utf-8");

  const users = JSON.parse(data);
  const user = users.find((d) => Number(d.id) === id);

  if (!user) {
    sendResponse(res, 404, false, "User not found");
  }

  sendResponse(res, 200, true, "User fetch successfully", user);
};

const createUser = async (req, res) => {
  const { name, email, age } = req.body;

  

  const data = await fs.readFile(usersFile, "utf-8");
  const users = JSON.parse(data);

  const existingUser = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase().trim(),
  );

  if (existingUser) {
    sendResponse(res, 409, false, "Email already exists");
  }

  const newUserId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
  const newUser = {
    id: newUserId,
    name,
    email,
    age,
  };

  users.push(newUser);

  fs.writeFile(usersFile, JSON.stringify(users, null, 2));
  sendResponse(res, 201, true, "User create successfully", newUser);
};

const updateUser = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return sendResponse(res, 400, false, "Invalid user ID");
  }

  const data = await fs.readFile(usersFile, "utf-8");
  const users = JSON.parse(data);

  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return sendResponse(res, 404, false, "User does not exist");
  }

  const updatedUser = {
    id,
    name: req.body.name?.trim() ?? users[userIndex].name,
    email: req.body.email?.trim().toLowerCase() ?? users[userIndex].email,
    age: req.body.age ?? users[userIndex].age,
  };

  users[userIndex] = updatedUser;

  await fs.writeFile(usersFile, JSON.stringify(users, null, 2));

  sendResponse(res, 200, true, "User updated successfully", updatedUser);
};

const deleteUser = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    sendResponse(res, 409, false, "Invalid user ID");
  }

  const data = await fs.readFile(usersFile, "utf-8");
  const users = JSON.parse(data);
  const updateUsers = users.filter((u) => Number(u.id) !== id);

  fs.writeFile(usersFile, JSON.stringify(updateUsers, null, 2));
  sendResponse(res, 200, true, "User deleted successfully");
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };

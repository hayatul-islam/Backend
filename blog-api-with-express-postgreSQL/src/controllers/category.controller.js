const categoryModel = require("../models/category.model");
const sendResponse = require("../utils/response");

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    const category = await categoryModel.createCategory(name);

    return sendResponse(
      res,
      201,
      true,
      "Category created successfully",
      category,
    );
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryModel.getAllCategories();

    return sendResponse(
      res,
      200,
      true,
      "Categories fetched successfully",
      categories,
    );
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await categoryModel.getCategoryById(id);

    if (!category) {
      return sendResponse(res, 404, false, "Category not found");
    }

    return sendResponse(
      res,
      200,
      true,
      "Category fetched successfully",
      category,
    );
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await categoryModel.updateCategory(id, name);

    if (!category) {
      return sendResponse(res, 404, false, "Category not found");
    }

    return sendResponse(
      res,
      200,
      true,
      "Category updated successfully",
      category,
    );
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await categoryModel.deleteCategory(id);

    if (!category) {
      return sendResponse(res, 404, false, "Category not found");
    }

    return sendResponse(
      res,
      200,
      true,
      "Category deleted successfully",
      category,
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};

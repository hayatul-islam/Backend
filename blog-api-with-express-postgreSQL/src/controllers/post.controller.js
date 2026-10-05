const postModel = require("../models/post.model");
const sendResponse = require("../utils/response");
const categoryModel = require("../models/category.model");
const commentModel = require("../models/comment.model");
const { isValidId } = require("../utils/isValidId");

const getPosts = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const search = req.query.search?.trim() || "";

    const posts = await postModel.getAllPosts(page, limit, search);

    const totalPosts = await postModel.getTotalPosts();

    const totalPages = Math.ceil(totalPosts / limit);

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,

      author: {
        id: post.author_id,
        name: post.author_name,
      },

      category: {
        id: post.category_id,
        name: post.category_name,
      },

      createdAt: post.created_at,
      updatedAt: post.updated_at,
    }));

    return sendResponse(res, 200, true, "Posts fetched successfully", {
      pagination: {
        page,
        limit,
        total: totalPosts,
        totalPages,
      },
      posts: formattedPosts,
    });
  } catch (error) {
    next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return sendResponse(res, 400, false, "Invalid post ID");
    }

    const post = await postModel.getPostById(id);

    if (!post) {
      return sendResponse(res, 404, false, "Post not found");
    }

    const comments = await commentModel.getCommentsByPostId(id);

    const formattedPost = {
      id: post.id,
      title: post.title,
      content: post.content,

      author: {
        id: post.author_id,
        name: post.author_name,
      },

      category: post.category_id
        ? {
            id: post.category_id,
            name: post.category_name,
          }
        : null,

      comments: comments.map((com) => ({
        id: com.id,
        content: com.content,
        user: {
          id: com.user_id,
          name: com.user_name,
        },
        created_at: com.created_at,
      })),

      createdAt: post.created_at,
      updatedAt: post.updated_at,
    };

    return sendResponse(
      res,
      200,
      true,
      "Post fetched successfully",
      formattedPost,
    );
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const { title, content, category_id } = req.body;
    const authorId = req.user.id;

    if (category_id !== undefined && category_id !== null) {
      const category = await categoryModel.getCategoryById(category_id);

      if (!category) {
        return sendResponse(res, 404, false, "Category not found");
      }
    }

    const post = await postModel.createPost({
      title,
      content,
      authorId,
      category_id,
    });

    return sendResponse(res, 201, true, "Post created successfully", post);
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return sendResponse(res, 400, false, "Invalid post ID");
    }

    const { title, content, category_id } = req.body;

    const existingPost = await postModel.getPostById(id);

    if (!existingPost) {
      return sendResponse(res, 404, false, "Post not found");
    }

    if (existingPost.author_id !== req.user.id && req.user.role !== 'admin') {
      return sendResponse(
        res,
        403,
        false,
        "You are not authorized to update this post",
      );
    }

    if (category_id !== undefined && category_id !== null) {
      const category = await categoryModel.getCategoryById(category_id);

      if (!category) {
        return sendResponse(res, 404, false, "Category not found");
      }
    }

    const post = await postModel.updatePost(id, {
      title,
      content,
      category_id,
    });

    return sendResponse(res, 200, true, "Post updated successfully", post);
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return sendResponse(res, 400, false, "Invalid post ID");
    }

    const post = await postModel.deletePost(id);
    if (!post) {
      return sendResponse(res, 404, false, "Post not found");
    }

    if (post.author_id !== req.user.id && req.user.role !== 'admin') {
      return sendResponse(
        res,
        403,
        false,
        "You are not authorized to delete this post",
      );
    }

    return sendResponse(res, 200, true, "Post deleted successfully", post);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
};

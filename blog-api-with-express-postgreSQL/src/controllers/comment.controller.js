const commentModel = require("../models/comment.model");
const postModel = require("../models/post.model");
const sendResponse = require("../utils/response");

const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const post = await postModel.getPostById(postId);

    if (!post) {
      return sendResponse(res, 404, false, "Post not found");
    }

    const userId = req.user.id;

    const comment = await commentModel.createComment({
      content,
      postId,
      userId,
    });

    return sendResponse(
      res,
      201,
      true,
      "Comment created successfully",
      comment,
    );
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await postModel.getPostById(postId);

    if (!post) {
      return sendResponse(res, 404, false, "Post not found");
    }

    const comments = await commentModel.getCommentsByPostId(postId);

    return sendResponse(
      res,
      200,
      true,
      "Comments fetched successfully",
      comments,
    );
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const existingComment = await commentModel.getCommentById(id);

    if (!existingComment) {
      return sendResponse(res, 404, false, "Comment not found");
    }

    if (existingComment.user_id !== req.user.id && req.user.role !== 'admin') {
      return sendResponse(
        res,
        403,
        false,
        "You are not authorized to update this comment",
      );
    }

    const comment = await commentModel.updateComment(id, content);

    return sendResponse(
      res,
      200,
      true,
      "Comment updated successfully",
      comment,
    );
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingComment = await commentModel.getCommentById(id);

    if (!existingComment) {
      return sendResponse(res, 404, false, "Comment not found");
    }

    if (existingComment.user_id !== req.user.id && req.user.role !== 'admin') {
      return sendResponse(
        res,
        403,
        false,
        "You are not authorized to delete this comment",
      );
    }

    const comment = await commentModel.deleteComment(id);

    return sendResponse(
      res,
      200,
      true,
      "Comment deleted successfully",
      comment,
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};

const pool = require("../config/db");

const createComment = async ({ content, postId, userId }) => {
  const result = await pool.query(
    `
    INSERT INTO comments (
      content,
      post_id,
      user_id
    )
    VALUES ($1, $2, $3)
    RETURNING
      id,
      content,
      post_id,
      user_id,
      created_at
    `,
    [content, postId, userId],
  );

  return result.rows[0];
};

const getCommentsByPostId = async (postId) => {
  const result = await pool.query(
    `
    SELECT
      c.id,
      c.content,
      c.post_id,
      c.user_id,
      c.created_at,

      u.name AS user_name

    FROM comments c

    JOIN users u
      ON c.user_id = u.id

    WHERE c.post_id = $1

    ORDER BY c.id DESC
    `,
    [postId],
  );

  return result.rows;
};

const getCommentById = async (id) => {
  const result = await pool.query(
    `
    SELECT
      c.id,
      c.content,
      c.post_id,
      c.user_id,
      c.created_at,

      u.name AS user_name

    FROM comments c

    JOIN users u
      ON c.user_id = u.id

    WHERE c.id = $1
    `,
    [id],
  );

  return result.rows[0];
};

const updateComment = async (id, content) => {
  const result = await pool.query(
    `
    UPDATE comments
    SET content = $1
    WHERE id = $2
    RETURNING
      id,
      content,
      post_id,
      user_id,
      created_at
    `,
    [content, id],
  );

  return result.rows[0];
};

const deleteComment = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM comments
    WHERE id = $1
    RETURNING
      id,
      content,
      post_id,
      user_id
    `,
    [id],
  );

  return result.rows[0];
};

module.exports = {
  createComment,
  getCommentsByPostId,
  getCommentById,
  updateComment,
  deleteComment,
};

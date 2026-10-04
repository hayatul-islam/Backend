const pool = require("../config/db");

const createPost = async ({ title, content, authorId, category_id }) => {
  const result = await pool.query(
    `
        INSERT INTO posts (
            title,
            content,
            author_id,
            category_id
        )
        VALUES ($1, $2, $3, $4)
        RETURNING id, title, content, author_id, category_id, created_at
        `,
    [title, content, authorId, category_id],
  );

  return result.rows[0];
};

const getTotalPosts = async () => {
  const result = await pool.query(`
        SELECT COUNT(*) AS total
        FROM posts    
    `);
  return parseInt(result.rows[0].total, 10);
};

const getAllPosts = async (page = 1, limit = 10, search = "") => {
  const offset = (page - 1) * limit;
  const result = await pool.query(
    `
        SELECT 
            p.id, 
            p.title, 
            p.content, 
            p.author_id, 
            p.created_at, 
            p.updated_at, 

            u.name AS author_name, 
            u.id AS author_id,

            cat.id AS category_id,
            cat.name AS category_name


        FROM posts p

        JOIN users u
            ON p.author_id = u.id

        LEFT JOIN categories cat
            ON p.category_id = cat.id

        WHERE p.title LIKE $3 OR p.content LIKE $3

        ORDER BY id DESC

        LIMIT $1 
        OFFSET $2
    `,
    [limit, offset, `%${search}%`],
  );

  return result.rows;
};

const getPostById = async (id) => {
  const result = await pool.query(
    `
        SELECT 
            p.id, 
            p.title, 
            p.content, 
            p.author_id, 
            p.created_at, 
            p.updated_at, 

            u.name AS author_name, 
            u.id AS author_id,

            cat.id AS category_id,
            cat.name AS category_name
            
        FROM posts p
        JOIN users u
            ON p.author_id = u.id
        LEFT JOIN categories cat
            ON p.category_id = cat.id
        WHERE p.id = $1
        `,
    [id],
  );

  return result.rows[0];
};

const updatePost = async (id, { title, content, category_id }) => {
  const result = await pool.query(
    `
    UPDATE posts
    SET
        title = COALESCE($1, title),
        content = COALESCE($2, content),
        category_id = COALESCE($3, category_id),
        updated_at = NOW()
    WHERE id = $4
    RETURNING
        id,
        title,
        content,
        author_id,
        category_id,
        created_at,
        updated_at
    `,
    [title, content, category_id, id],
  );

  return result.rows[0];
};

const deletePost = async (id) => {
  const result = await pool.query(
    `
        DELETE FROM posts
        WHERE id = $1
        RETURNING id, title, content, author_id
        `,
    [id],
  );

  return result.rows[0];
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getTotalPosts,
};

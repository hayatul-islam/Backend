const pool = require("../config/db");

const createCategory = async (name) => {
  const result = await pool.query(
    `
        INSERT INTO categories (name)
        VALUES ($1)
        RETURNING id, name, created_at
        `,
    [name],
  );

  return result.rows[0];
};

const getAllCategories = async () => {
  const result = await pool.query(
    `
        SELECT id, name, created_at
        FROM categories
        ORDER BY id ASC
        `,
  );

  return result.rows;
};

const getCategoryById = async (id) => {
  const result = await pool.query(
    `
        SELECT id, name, created_at
        FROM categories
        WHERE id = $1
        `,
    [id],
  );

  return result.rows[0];
};

const updateCategory = async (id, name) => {
  const result = await pool.query(
    `
        UPDATE categories
        SET name = $1
        WHERE id = $2
        RETURNING id, name, created_at
        `,
    [name, id],
  );

  return result.rows[0];
};

const deleteCategory = async (id) => {
  const result = await pool.query(
    `
        DELETE FROM categories
        WHERE id = $1
        RETURNING id, name
        `,
    [id],
  );

  return result.rows[0];
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};

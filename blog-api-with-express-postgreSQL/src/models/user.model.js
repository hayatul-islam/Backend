const pool = require("../config/db");
const bcrypt = require("bcrypt");

const getAllUsers = async () => {
  const result = await pool.query(`
        SELECT id, name, email, role, created_at
        FROM users
        ORDER BY id ASC
    `);

  return result.rows;
};

const getUserById = async (id) => {
  const result = await pool.query(
    `
        SELECT id, name, email, image, created_at
        FROM users
        WHERE id = $1
        `,
    [id],
  );

  return result.rows[0];
};

const createUser = async ({ name, email, password }) => {
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
      INSERT INTO users(name, email, password)
      VALUES($1, $2, $3)
      RETURNING id, name, email, created_at
    `,
    [name, email, hashPassword],
  );

  return result.rows[0];
};

const updateUser = async (id, { name, email, password }) => {
  let hashPassword = null;
  if (password) {
    hashPassword = await bcrypt.hash(password, 10);
  }

  const result = await pool.query(
    `
        UPDATE users
        SET
            name = COALESCE($1, name),
            email = COALESCE($2, email),
            password = COALESCE($3, password)
        WHERE id = $4
        RETURNING id, name, email, created_at
        `,
    [name, email, hashPassword, id],
  );

  return result.rows[0];
};

const deleteUser = async (id) => {
  const result = await pool.query(
    `
      DELETE FROM users
      WHERE id = $1
      RETURNING id, name, email
    `,
    [id],
  );

  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const result = await pool.query(
    `
      SELECT *
      FROM users
      WHERE email = $1
    `,
    [email],
  );
  return result.rows[0];
};

const updateUserRole = async (id, role) => {
  const result = await pool.query(
    `
    UPDATE users
    SET role = $2
    WHERE id = $1
    RETURNING id, name, email, role, created_at
    `,
    [id, role],
  );
  return result.rows[0];
};

const updateProfileImage = async (id, profileImage) => {
  const result = await pool.query(
    `
    UPDATE users
    SET image = $1
    WHERE id = $2
    RETURNING id, name, email, role, image, created_at
    `,
    [profileImage, id],
  );

  return result.rows[0];
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
  updateUserRole,
  updateProfileImage,
};

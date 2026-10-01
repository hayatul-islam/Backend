const pool = require("../config/db");

const createRefreshToken = async ({ userId, token, expiresAt }) => {
  const result = await pool.query(
    `
        INSERT INTO refresh_tokens (
            user_id,
            token,
            expires_at
        )
        VALUES ($1, $2, $3)
        RETURNING id, user_id, token, expires_at, created_at
        `,
    [userId, token, expiresAt],
  );

  return result.rows[0];
};

const getRefreshToken = async (token) => {
  console.log("Token received:", token);

  const result = await pool.query(
    `
        SELECT id, user_id, token, expires_at
        FROM refresh_tokens
        WHERE token = $1
        `,
    [token],
  );


  return result.rows[0];
};

const deleteRefreshToken = async (token) => {
  const result = await pool.query(
    `
        DELETE FROM refresh_tokens
        WHERE token = $1
        RETURNING id
        `,
    [token],
  );

  return result.rows[0];
};

module.exports = {
  createRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
};

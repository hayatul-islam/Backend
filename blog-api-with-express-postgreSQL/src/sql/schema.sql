
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users
ADD CONSTRAINT email UNIQUE(email);

CREATE TABLE refresh_tokens(
	id SERIAL PRIMARY KEY,
	user_id INT NOT NULL,
	token TEXT NOT NULL UNIQUE,
	expires_at TIMESTAMPTZ NOT NULL,
	created_at TIMESTAMPTZ DEFAULT NOW(),

	CONSTRAINT fk_refresh_token_user
		FOREIGN KEY (user_id)
		REFERENCES users(id)
		ON DELETE CASCADE
);

ALTER TABLE users
ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user';

ALTER TABLE users
ADD CONSTRAINT users_role_check
CHECK (role IN ('admin', 'user'))
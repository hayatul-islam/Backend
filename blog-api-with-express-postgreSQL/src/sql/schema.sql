
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
CHECK (role IN ('admin', 'user'));

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_post_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

ALTER TABLE posts
RENAME COLUMN user_id TO author_id;

ALTER TABLE posts
RENAME CONSTRAINT fk_post_user TO fk_post_author;

SELECT * FROM posts;

CREATE TABLE categories(
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL UNIQUE,
	created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE posts
ADD COLUMN category_id INT;

ALTER TABLE posts
ADD CONSTRAINT fk_post_category
FOREIGN KEY (category_id)
REFERENCES categories(id)
ON DELETE SET NULL;

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_comment_post
        FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_comment_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_posts_author_id
ON posts(author_id);

CREATE INDEX idx_comments_post_id
ON comments(post_id);

EXPLAIN ANALYZE
SELECT *
FROM posts
WHERE author_id = 1;

CREATE TABLE students (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	age INT NOT NULL,
	course VARCHAR(100) NOT NULL,
	gpa NUMERIC(3, 2),
	created_at TIMESTAMPTZ DEFAULT NOW()
)

INSERT INTO students (name, age, course, gpa)
VALUES
('King', 15, 'Computer Science', 2.75),
('Karim Hasan', 22, 'Software Engineering', 3.50),
('Nusrat Jahan', 20, 'Information Technology', 3.90),

-- ADD COLUMN
ALTER TABLE students
	ADD COLUMN email VARCHAR(100)

-- DROP COLUMN
ALTER TABLE students
	DROP COLUMN email

-- RENAME
ALTER TABLE students
	RENAME COLUMN course TO course_name

ALTER TABLE learners
	RENAME TO students

-- CHECK CONSTRAINT
ALTER TABLE students
	ADD CONSTRAINT check_age
CHECK(age >= 5 AND age <= 30);

ALTER TABLE students
	ADD CONSTRAINT check_gpa
CHECK(gpa >=0 AND gpa <= 4);

-- COLUMN TYPE
ALTER TABLE students
ALTER COLUMN name TYPE VARCHAR(150)

-- SET DEFAULT 
ALTER TABLE students
ALTER COLUMN gpa SET DEFAULT 0;


SELECT * FROM students


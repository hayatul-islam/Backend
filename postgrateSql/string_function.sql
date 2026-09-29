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
('Rahim Ahmed', 21, 'Computer Science', 3.75),
('Karim Hasan', 22, 'Software Engineering', 3.50),
('Nusrat Jahan', 20, 'Information Technology', 3.90),
('Sadia Islam', 23, 'Computer Science', 3.25),
('Tanvir Hossain', 21, 'Software Engineering', 3.65),
('Mim Akter', 20, 'Information Technology', 3.80),
('Sakib Khan', 22, 'Computer Science', 3.45),
('Jannatul Ferdous', 21, 'Data Science', 3.95),
('Fahim Rahman', 24, 'Software Engineering', 3.20),
('Sumaiya Ahmed', 20, 'Computer Science', 3.70),
('Rafiul Islam', 23, 'Data Science', 3.55),
('Tania Sultana', 22, 'Information Technology', 3.85),
('Shakil Ahmed', 21, 'Computer Science', 3.30),
('Priya Das', 20, 'Software Engineering', 3.60),
('Mehedi Hasan', 24, 'Data Science', 3.40);

-- CONCAT
SELECT CONCAT(name, ' - ', course) 
FROM students

-- LENGTH
SELECT LENGTH(name) AS name_size
FROM students

-- UPPSER & LOWER
SELECT name,
	UPPER(name) AS upper_name,
	LOWER(name) AS lower_name
FROM students

-- SUBSTRING
SELECT name,
	SUBSTRING(name, 1, 3) AS first_3,
	SUBSTRING(course, 1, 5) AS first_4
FROM students

-- REPLACE
SELECT name, course, 
REPlACE(course, 'Computer Science', 'CSE') AS updated_course
FROM students
WHERE course = 'Computer Science'

-- TRIM
SELECT '  Hayatul  ' AS new_name,
	TRIM('  Hayatul  ') AS trim,
	LTRIM('  Hayatul  ') AS left_trim,
	RTRIM('  Hayatul  ') AS right_trim


SELECT * FROM students

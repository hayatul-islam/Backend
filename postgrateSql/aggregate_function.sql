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

-- COUNT
SELECT COUNT(*) FROM students

-- SUM
SELECT SUM(age) FROM students

-- AVG
SELECT ROUND(AVG(age), 2) FROM students

-- MIN 
SELECT MIN(age) FROM students

-- MAX
SELECT MAX(age) FROM students

-- GROUP BY
SELECT course, COUNT(*) 
FROM students
GROUP BY course

-- HAVING 
SELECT course, COUNT(*)
FROM students
GROUP BY course
HAVING COUNT(*) > 2




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

-- WHERE 
SELECT * FROM students WHERE gpa >= 3.50

-- ORDER BY 
SELECT * FROM students ORDER BY age DESC

-- DISTINCT // UNIQUE VALUES FILTER
SELECT DISTINCT course FROM students

-- LIMIT & OFFSET FOR PAGINATION
SELECT * FROM students LIMIT 10 OFFSET 10

-- LIKE
SELECT * FROM students WHERE name LIKE 'S%'

-- IN // MULTIPLE VALUES MATCH
SELECT * FROM students WHERE course IN ('Computer Science', 'Software Engineering')

-- BETWEEN // RANGE CHECK
SELECT * FROM students WHERE age BETWEEN 24 AND 30

-- AND
SELECT * FROM students WHERE age >= 22 AND gpa >= 3.50

-- OR 
SELECT * FROM students WHERE course = 'Software Engineering' OR course = 'Data Science'

-- NOT 
SELECT * FROM studentS WHERE NOT course = 'Software Engineering'

-- IS NULL / IS NOT NULL
SELECT * FROM students WHERE gpa IS NULL
SELECT * FROM students WHERE gpa IS NOT NULL

-- AS
SELECT name AS student_name, gpa AS student_gpa FROM students

-- GROUP BY
SELECT course, COUNT(*) 
FROM students GROUP BY course

-- HAVING 
SELECT course, COUNT(*) AS total_students 
FROM students GROUP BY course 
HAVING COUNT(*) > 3;

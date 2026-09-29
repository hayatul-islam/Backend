-- INNER JOIN
SELECT 
    s.name,
    c.name AS course_name,
    c.teacher AS teacher_name 
FROM students s
INNER JOIN courses c
    ON s.course_id = c.id;

-- LEFT JOIN
SELECT 
    s.name AS student_name,
    c.name AS course_name
FROM students s
LEFT JOIN courses c
    ON s.course_id = c.id;

-- RIGHT JOIN
SELECT s.name, c.name AS course_name
FROM students s
RIGHT JOIN courses c
	ON s.course_id = c.id;

-- FULL OUTER JOIN
SELECT s.name AS student_name, c.name AS course_name
FROM students s
FULL OUTER JOIN courses c
ON s.course_id = c.id;

CREATE TABLE employees(
	id SERIAL PRIMARY KEY,
	name VARCHAR(100),
	manager_id INT
);

INSERT INTO employees (name, manager_id)
VALUES
('Rahim', NULL),
('Karim', 1),
('Siam', 1),
('Nabil', 2),
('Hasan', 2);

SELECT * FROM employees;

-- SELF JOIN
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m
	ON e.manager_id = m.id;

-- CROSS JOIN
SELECT c.name AS course_name, s.name AS student_name
FROM courses c
CROSS JOIN students s
ORDER BY c.name, s.name

-- MULTIPLE JOIN
SELECT s.name, c.name AS course_name, c.teacher AS teacher_name
FROM students S
JOIN student_courses sc
	ON s.id = sc.student_id
JOIN courses c
	ON s.course_id = c.id;

-- =========================
-- COURSES
-- =========================

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    teacher VARCHAR(100) NOT NULL
);

INSERT INTO courses(name, teacher)
VALUES
('React.js', 'Sakib'),
('Next.js', 'Rahim'),
('TypeScript', 'Nusrat'),
('PostgreSQL', 'Karim'),
('Express.js', 'Hasan');


-- =========================
-- STUDENTS
-- One Course → Many Students
-- =========================

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    course_id INT,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

INSERT INTO students(name, course_id)
VALUES 
('Siam', 1),
('Nabil', 3),
('Arif', 2),
('Rafi', 4),
('Shakil', 3),
('Mehedi', 1),
('Sabbir', 5);


-- =========================
-- PROFILES
-- One Student → One Profile
-- =========================

CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    student_id INT UNIQUE NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(200),
    FOREIGN KEY (student_id) REFERENCES students(id)
);


-- =========================
-- STUDENT COURSES
-- Many-to-Many Relationship
-- Many Students → Many Courses
-- =========================

CREATE TABLE student_courses (
    student_id INT NOT NULL,
    course_id INT NOT NULL,

    PRIMARY KEY (student_id, course_id),

    FOREIGN KEY (student_id)
        REFERENCES students(id),

    FOREIGN KEY (course_id)
        REFERENCES courses(id)
);


INSERT INTO student_courses (student_id, course_id)
VALUES
(1, 1), -- Siam → React
(1, 2), -- Siam → Next
(1, 3), -- Siam → Node

(2, 1), -- Nabil → React
(2, 4), -- Nabil → PostgreSQL

(3, 2), -- Arif → Next
(3, 3), -- Arif → Node

(4, 1), -- Rafi → React
(4, 4), -- Rafi → PostgreSQL

(5, 3); -- Shakil → Node


SELECT
    students.name AS student_name,
    courses.name AS course_name
FROM student_courses
JOIN students
    ON student_courses.student_id = students.id
JOIN courses
    ON student_courses.course_id = courses.id;


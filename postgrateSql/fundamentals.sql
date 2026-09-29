CREATE TABLE teachers (
	id SERIAL PRIMARY KEY,
	teacher_name VARCHAR(100) NOT NULL,
	course_name VARCHAR(100) NOT NULL,
	duration INT NOT NULL,
	seat INT NOT NULL,
	created_at TIMESTAMPTZ DEFAULT NOW()
)

INSERT INTO teachers (teacher_name, course_name, duration, seat)
VALUES 
('Hayatul', 'Javascript', null, null),
('Emon', 'Reactjs', 6, 100),
('Rumman', 'Nodejs', 3, 150)


UPDATE teachers
SET duration = 6
WHERE id = 3

DELETE FROM teachers
WHERE id = 3


SELECT * FROM teachers

DROP TABLE teachers 


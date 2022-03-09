USE employee_tracker_db;

INSERT INTO departments(id,name)
VALUES(1,'Sales'),
(2,'Marketing'),
(3,'HR');

INSERT INTO roles(id, title, salary, department_id)
VALUES(1,'Sales Leader', 75000.00, 1),
(2,'Junior Salesman', 60000.00, 1),
(3,'Marketing Leader', 90000.00, 2),
(4,'Junior Associate', 55000.00, 2),
(5,'HR Manager', 95000.00, 3),
(6,'Secretary', 50000.00, 3);

INSERT INTO employees(id,first_name, last_name, role_id, manager_id)
VALUES(1,'Mickey', 'Mouse', 1, NULL),
(2,'Donald', 'Duck', 2, 1),
(3,'Bruno', 'Madrigal', 2, 1),
(4,'Chicken', 'Little', 3, NULL),
(5,'Doofus', 'Drake', 4, 4),
(6,'Fa', 'Zhou', 4, 4),
(7,'Figaro', 'Cat', 5, NULL),
(8,'Gladstone', 'Gander', 6, 7),
(9,'Heihei', 'Rooster', 6, 7);
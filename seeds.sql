USE employee_tracker_db;

INSERT INTO departments(name)
VALUES('Sales'),
('Marketing'),
('HR');

INSERT INTO roles(title, salary, department_id)
VALUES('Sales Leader', 75000.00, 1),
('Junior Salesman', 60000.00, 1),
('Marketing Leader', 90000.00, 2),
('Junior Associate', 55000.00, 2),
('HR Manager', 95000.00, 3),
('Secretary', 50000.00, 3);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES('Mickey', 'Mouse', 1, NULL),
('Donald', 'Duck', 2, 1),
('Bruno', 'Madrigal', 2, 1),
('Chicken', 'Little', 3, NULL),
('Doofus', 'Drake', 4, 4),
('Fa', 'Zhou', 4, 4),
('Figaro', 'Cat', 5, NULL),
('Gladstone', 'Gander', 6, 7),
('Heihei', 'Rooster', 6, 7);
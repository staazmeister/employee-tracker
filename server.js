const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');
const Employee = require(__dirname + '/classes/Employee.js');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: 'password',
    database: "employee_tracker_db"
});

console.log('\n\nWelcome to the Employee Tracker\n\n===============================');
connection.connect();
init();

function init() {
    console.log('\n\n')
    inquirer.prompt([{
        type: 'list',
        name: 'init',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Update Employee', 'Add Department', 'Add Role', 'Add Employee', 'Delete Department', 'Delete Role', 'Delete Employee', 'Exit Employee Tracker'],
    }]).then((answers) => {
        switch (answers.init) {
            case 'Exit Employee Tracker':
                connection.end();
                console.log('Goodbye');
                break;
            case 'Update Employee':
                updateEmployee();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'View All Departments':
                viewDepartments();
                break;
            case 'View All Employees':
                viewEmployees();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'Delete Employee':
                deleteEmployee();
                break;
            case 'Delete Department':
                deleteDepartment();
                break;
            case 'Delete Role':
                deleteRole();
                break;
        }
    })
}
//VIEW FUNCTION//
// View all departments
function viewDepartments() {
    connection.query(`SELECT id AS 'ID', name AS 'Departments' FROM departments`, (err, res) => {
        if (err) throw err;
        console.log('\n\n')
        console.table(res);
        init();
    });
}
// View Roles
function viewRoles() {
    connection.query(`SELECT r.id AS 'ID', r.title AS 'Role', d.name AS 'Department', r.salary AS 'Salary'
                      FROM roles r
                      JOIN departments d
                      ON r.department_id = d.id
                      ORDER BY r.department_id`,
        (err, res) => {
            if (err) throw err;
            console.log('\n\n')
            console.table(res);
            init();
        });
}
// View Employees
function viewEmployees() {
    connection.query(`SELECT e.id as 'ID', e.last_name AS 'Last Name', e.first_name AS 'First Name', r.title AS 'Role', d.name AS 'Department', r.salary AS 'Salary', m.last_name AS 'Manager'
                      FROM employees e
                      JOIN roles r
                      ON e.role_id = r.id
                      LEFT JOIN departments d
                      ON r.department_id = d.id
                      LEFT JOIN employees m
                      ON e.manager_id = m.id
                      ORDER BY e.id`, (err, res) => {
        if (err) throw err;
        console.log('\n\n')
        console.table(res);
        init();
    });

}
//ADD FUNCTIONS//

function addEmployee() {
    const rolesData = [];
    const rolesNames = [];

    const employeesData = [];
    const employeesNames = ['No Manager'];

    getRolesAsync()
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                rolesData.push(data[i]);
                rolesNames.push(data[i].role)
            }

            getEmployeesAsync()
                .then(data => {
                    for (let i = 0; i < data.length; i++) {
                        employeesData.push(data[i]);
                        employeesNames.push(data[i].last_name)
                    }
                }).catch(err => {
                    console.log(err);
                })
        }).catch(err => {
            console.log(err);
        });

    inquirer.prompt([{
            type: 'input',
            name: 'firstName',
            message: `What is the employee's first name?`,
            default: () => {},
            validate: firstName => {
                let valid = /^[a-zA-Z0-9 ]{1,30}$/.test(firstName);
                if (valid) {
                    return true;
                } else {
                    console.log(`. Your name must be between 1 and 30 characters.`)
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: `What is the employee's last name?`,
            default: () => {},
            validate: lastName => {
                let valid = /^[a-zA-Z0-9 ]{1,30}$/.test(lastName);
                if (valid) {
                    return true;
                } else {
                    console.log(`. Your name must be between 1 and 30 characters.`)
                    return false;
                }
            }

        },
        {
            type: 'list',
            name: 'role',
            message: `What is the employee's role?`,
            choices: rolesNames
        },
        {
            type: 'list',
            name: 'manager',
            message: `Who is the employee's manager?`,
            choices: employeesNames
        }
    ]).then(answers => {
        let roleId;
        let managerId;

        for (let i = 0; i < rolesData.length; i++) {
            if (answers.role === rolesData[i].role) {
                roleId = rolesData[i].id;
            }
        }

        for (let i = 0; i < employeesData.length; i++) {
            if (answers.manager === employeesData[i].last_name) {
                managerId = employeesData[i].id;
            } else if (answers.manager === 'No Manager') {
                managerId = null;
            }
        }
        insertEmployee(answers.firstName, answers.lastName, roleId, managerId);
    });
}

function insertEmployee(firstName, lastName, roleId, managerId) {
    connection.query('INSERT INTO employees SET ?', new Employee(firstName, lastName, roleId, managerId), (err, res) => {
        if (err) throw err;
        console.log(`Successfully added ${firstName} ${lastName} to Employees`);
        init();
    });
}

// ===============
// Async Functions
// ===============

function getRolesAsync() {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT id, title AS 'role' FROM roles ORDER BY role`, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
}

function getEmployeesAsync() {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT id, last_name FROM employees ORDER BY last_name`, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
}

function getDepartmentsAsync() {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM departments`, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        })
    })
}
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');
const Department = require(__dirname + '/classes/Department.js');
const Role = require(__dirname + '/classes/Role.js');
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
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Update Employee', 'Add Department', 'Add Role', 'Add Employee', 'Exit Employee Tracker'],
    }]).then((answers) => {
        switch (answers.init) {
            case 'Exit Employee Tracker':
                connection.end();
                console.log('Goodbye!');
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
        }
    })
}

//VIEW FUNCTIONS//

// View all Departments
function viewDepartments() {
    connection.query(`SELECT id AS 'ID', name AS 'Departments' FROM departments`, (err, res) => {
        if (err) throw err;
        console.log('\n\n')
        console.table(res);
        init();
    });
}
// View all Roles
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

// Add New Department
function addDepartment() {
    inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'What is the name of the new department?',
    }]).then((answers) => {
        insertDepartment(answers.name);
    });
}

function insertDepartment(newDepot) {
    connection.query('INSERT INTO departments SET ?', new Department(newDepot), (err, res) => {
        if (err) throw err;
        console.log(`Successfully added ${newDepot} to Departments`);
        init();
    });
}

// Add New Role
function addRole() {
    const array = [];
    getDepartmentsAsync()
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                array.push(data[i])
            }
        })
        .catch(err => {
            console.log(err);
        });

    inquirer.prompt([{
            type: 'input',
            name: 'title',
            message: 'What is the title of the new role?',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the new role?',
        },
        {
            type: 'list',
            name: 'department',
            message: 'In which department is the new role?',
            choices: array
        }
    ]).then(answers => {
        let departmentId;
        for (let i = 0; i < array.length; i++) {
            if (answers.department === array[i].name) {
                departmentId = array[i].id;
            }
        }
        insertRole(answers.title, answers.salary, departmentId);
    })
}

function insertRole(title, salary, department_id) {
    connection.query('INSERT INTO roles SET ?', new Role(title, salary, department_id), (err, res) => {
        if (err) throw err;
        console.log(`Successfully added ${title} to Roles`);
        init();
    });

}
//Add New Employee
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
        },
        {
            type: 'input',
            name: 'lastName',
            message: `What is the employee's last name?`,
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

// Update Employee's Role
function updateEmployee() {
    const rolesData = [];
    const rolesNames = [];

    const employeesData = [];
    const employeesNames = [];

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
                    updateEmployeeQuestions(rolesData, rolesNames, employeesData, employeesNames);
                }).catch(err => {
                    console.log(err);
                })
        }).catch(err => {
            console.log(err);
        });
}


function updateEmployeeQuestions(rolesData, rolesNames, employeesData, employeesNames) {
    inquirer.prompt([{
            type: 'list',
            name: 'employee',
            message: 'Which employee would you like to update?',
            choices: employeesNames,
        },
        {
            type: 'list',
            name: 'update',
            message: 'What information would you like to update?',
            choices: [`Employee's role`, 'Cancel']
        }
    ]).then(answers => {
        let employeeId;
        for (let i = 0; i < employeesData.length; i++) {
            if (answers.employee === employeesData[i].last_name) {
                employeeId = employeesData[i].id;
            }
        }
        if (answers.update === `Employee's role`) {
            getNewRoleId(employeeId, rolesData, rolesNames)
        }
    })
}


function getNewRoleId(employeeId, rolesData, rolesNames) {
    inquirer.prompt([{
        type: 'list',
        name: 'role',
        message: `What is the employee's new role?`,
        choices: rolesNames,
        pageSize: 12
    }]).then(answers => {
        let roleId;
        for (let i = 0; i < rolesData.length; i++) {
            if (answers.role === rolesData[i].role) {
                roleId = rolesData[i].id;
            }
        }
        updateEmployeeRole(employeeId, roleId)
    })
}

function updateEmployeeRole(employeeId, roleId) {
    connection.query(`UPDATE employees SET ? WHERE ?`, [{
                role_id: roleId
            },
            {
                id: employeeId
            }
        ],
        (err, res) => {
            if (err) throw err;
            console.log(`Successfully changed employee's role`);
            init();
        })
}


// Async Functions
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
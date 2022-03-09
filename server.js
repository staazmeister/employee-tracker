const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');

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
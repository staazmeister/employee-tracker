# Employee Tracker
Week 12 Homework
This week's project was to build a command-line application using content management systems (CMS) to manage a company's employee database using Node.Js, Inquirer, and MySQL.  THe purpose of this project is to create a CMS interface that allows non-developers the ability to view and access information in stored databases.

# Installation
1. Copy the clone link of the repository from GitHub
2. Open Bash or Terminal Window
3. When the console opens, navigate to the directory the repository will be added to
4. In the console, type the command "git clone" and paste the link to repository
5. Open repository in preferred code editor
6. Open terminal in code editor
7. Type in terminal "npm init -y" to install dependency packages needed

  Ensure the following packages are installed
- Inquirer (If not inlcuded, you can install by typing "npm install inquirer" in the terminal)
- MySQL (If not inlcuded, you can install by typing "npm install MySQL" in the terminal)
- console.table (If not inlcuded, you can install by typing "npm install console.table" in the terminal)



# Usage
1. After repository has been cloned, using MySQL run the schema.sql by typing SOURCE schema.sql. This will create the database needed for this application.
2. Start the app by running command: node server.js. Then follow the prompts to view the app's features or create new content as needed.


## User Story (provided in the homework instructions)
```
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business

```
## Acceptance Criteria (provided in the homework instructions)
```
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 

```

## Why this project is important
The purpose of this project is apply our newly learned skills using command node js.

Skills to be implemented on this project are:
- Command Node.js 
- Inquirer
- MySql
-console.table 

## Actions taken for this project
- Utilized command Node.js 
- Utilized inquirer 
- Utilized console.table
- Used git commands to add, commit, and push all changes on to GitHub repository

## View of how application looks


![Screen Shot 2022-02-22 at 6 09 13 PM](https://user-images.githubusercontent.com/94095220/155250907-089be506-7f35-499e-85e7-2164adc04e25.png)




## Links to Application Video Demo and GitHup Repository
- Video demo of application: https://drive.google.com/file/d/1WJJ8T4f5h11kyYxu4RoW-6gbIZ-10Y-y/view
- Video demo of test(s): https://drive.google.com/file/d/1hgp8TfR60zth_X7NUS03RYboTVfw60eb/view

- URL for GitHub repository: https://github.com/staazmeister/team-profile-generator.git

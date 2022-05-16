//set requires
const inquirer = require('inquirer');
const mysql = require('mysqul');
const table = require('console.table');
const { start } = require('repl');

//set connections
const connection = mysql.createConnnection({
    host: 'localhost',
    port: 3001,
    user: 'root',
    password: 'passW@rd',
    database: 'employeesDB'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('DB connected');
    start();
});

//function start & user chocies
function start() {
    inquirer,
    prompt([{
        type: 'list',
        name: 'start',
        message: 'What would you like to do to the employee database',
        choices: ['view', 'add', 'update', 'exit']

    }]).then(function(res) {
        switch (res.start) {
            case 'view':
                view();
                break;
            case 'add':
                add();
                break;
            case 'update':
                update();
                break;
            case 'exit':
                console.log('------!!ALL DONE!!-------')
                break;
            default:
                console.log('please comfirm your action')
        }
    });
}

//view function
function view() {
    inquirer
        .prompt([{
            type: 'list',
            name: 'view',
            message: 'what would you like to see? scion',
            choices: ['all employees', ' sort by department', 'sort by role']

        }]).then(function(res) {
            switch (res.view) {
                case 'all emplyoees':
                    viewAll();
                    break;
                case 'sort by department':
                    viewDepartment();
                    break;
                case 'sort by role':
                    viewRole();
                    break;
                default:
                    console.log('please comfirm you view')
            }
        });
}

//function view all employees
function viewAll() {
    connection.query('SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, e.role_id AS Role, r.salary AS Salary, m.last_name AS Manager, d.name AS Department',
        function(err, results) {
            if (err) throw err;
            console.table(results);
            start();
        });
}

//function view all sort by department
function viewDepartment() {
    connection.query('SELECT * FROM department', function(err, resultes) {
        if (err) throw err;
        inquirer
            .prompt([{
                name: 'choice',
                type: 'rawlist',
                choices: function() {
                    let choiceArray = [];
                    for (i = 0; i < resultes.length; i++) {
                        choiceArray.push(resultes[i].name);
                    }
                    return choiceArray;
                },
                message: 'please select the department'
            }]).then(function(answer) {
                connection.query('SELECT e.id AS ID,e.first_name AS First,e.last_name AS Last,e.role_id AS Role,r.salary AS Salary,m.last_name AS Manager,d.name AS Department FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role ON e.role_id = r.title LEFT JOIN department d ON r.department_id = d.id WHERE d.name =?', [answer.choice], function(err, resultes) {
                    if (err) throw err;
                    console.table(resultes);
                    start();
                })
            });
    });
}
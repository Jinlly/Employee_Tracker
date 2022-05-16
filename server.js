//set requires
const inquirer = require("inquirer");
const mysql = require('mysqul');
const table = require('console.table');


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

//view function & view function set
function view() {
    inquirer
        .prompt([{
            type: 'list',
            name: 'view',
            message: 'what would you like to see? scion',
            choices: ['all employees', 'sort by department', 'sort by role']

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

//function view all sorted by department
function viewDepartment() {
    connection.query('SELECT * FROM department', function(err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                name: 'choice',
                type: 'rawlist',
                choices: function() {
                    let choiceArray = [];
                    for (i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].name);
                    }
                    return choiceArray;
                },
                message: 'please select the department'
            }]).then(function(answer) {
                connection.query('SELECT e.id AS ID,e.first_name AS First,e.last_name AS Last,e.role_id AS Role,r.salary AS Salary,m.last_name AS Manager,d.name AS Department FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role ON e.role_id = r.title LEFT JOIN department d ON r.department_id = d.id WHERE d.name =?', [answer.choice], function(err, results) {
                    if (err) throw err;
                    console.table(results);
                    start();
                })
            });
    });
}

//function view all sorted by roles
function viewRole() {
    connection.query('SELECT title FROM role', function(err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                name: 'choice',
                type: 'rewlist',
                choice: function() {
                    var chociesArray = [];
                    for (i = 0; i < results.length; i++) {
                        chociesArray.push(results[i].title);
                    }
                    return chociesArray;
                },
                message: 'please select the role'
            }]).then(function(answer) {
                console.log(answer.choice);
                connection.query(
                    'SELECT e.id AS ID,e.first_name AS First,e.last_name AS Last,e.role_id AS Role,r.salary AS Salary,m.last_name AS Manager,d.name AS Department FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role ON e.role_id = r.title LEFT JOIN department d ON r.department_id = d.id WHERE e.role_id =?', [answer.choice],
                    function(err, results) {
                        if (err) throw err;
                        console.table(results);
                        start();
                    }
                )
            });
    });
}

//add function & add function set
function add() {
    inquirer
        .prompt([{
            type: 'list',
            name: 'add',
            message: 'What would you like to add? sicon',
            choices: ['department', 'employee role', 'employee']

        }]).then(function(res) {
            switch (res.add) {
                case 'department':
                    adddepartment();
                    break;
                case 'employee role':
                    addRole();
                    break;
                case 'employee':
                    addEmployee();
                    break;
                default:
                    console.log('please comfirm you add action')
            }
        })
}

//add department
function adddepartment() {
    inquirer
        .prompt([{
            name: 'department',
            type: 'input',
            message: 'what would you name your department? sicon?'
        }]).then(function(answer) {
            connection.query('INSERT INTO department VALUES (DEFAULT,?)', [answer.department],
                function(err) {
                    if (err) throw err;
                    console.log('-----!!!!Departments updated with' + answer.department + '!!!!!-----')
                    start();
                }
            )
        })
}

//add employee role
function addRole() {
    inquirer
        .prompt([{
                name: 'role',
                type: 'input',
                message: 'Enter the title of the employee'
            },
            {
                name: 'salary',
                type: 'number',
                message: 'Enter the salary of the employee',
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: 'department_id',
                type: 'number',
                message: 'Enter department id',
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function(answer) {
            connection.query(
                'INSERT INTO role SET?', {
                    title: answer.role,
                    salary: answer.salary,
                    department_id: answer.department_id
                },

                function(err) {
                    if (err) throw err;
                    console.log('-----!!!!Departments updated with' + answer.role + '!!!!!-----');
                    start();
                }
            )
        })
}

//add employee
function addEmployee() {
    connection.query('SELECT * FROM role', function(err, results) {
        if (err) throw err;

        inquirer
            .prompt([{
                    name: 'firstName',
                    type: 'input',
                    message: 'Please enter the first name of the employee'
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: 'and any last name?'
                },
                {
                    name: 'role',
                    type: 'rawlist',
                    choices: function() {
                        var chociesArray = [];
                        for (i = 0; i < results.length; i++) {
                            chociesArray.push(results[i].title)
                        }
                        return chociesArray;
                    },
                    message: 'plase select the title'
                },
                {
                    name: 'manager',
                    type: 'number',
                    validate: function(value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    },
                    message: 'please enter the id of the manager',
                    default: '1'
                }
            ]).then(function(answer) {
                connection.query(
                    'INSERT INTO employee SET?', {
                        fitst_name: answer.firstName,
                        last_name: answer.lastName,
                        role_id: answer.role,
                        manager_id: answer.manager
                    }
                )
                console.log('-----!!!!employee added!!!!!-----');
                start();
            });
    });
}

//update function
function update() {
    connection.query('SELECT * FROM employee',
        function(err, results) {
            if (err) throw err;
            inquirer
                .prompt([{
                    name: 'choice',
                    type: 'rawlist',
                    choices: function() {
                        let chociesArray = [];
                        for (i = 0; i < results.length; i++) {
                            chociesArray.push(results[i].last_name);
                        }
                        return chociesArray;
                    },
                    message: 'please select which would you like to update, sicon'

                }]).then(function(answer) {
                    const saveName = answer.choice;
                    connection.query('SELECT * FROM emplyoee',
                        function(err, results) {
                            if (err) throw err;
                            inquirer
                                .prompt([{
                                        name: 'role',
                                        type: 'rawlist',
                                        choices: function() {
                                            var chociesArray = []
                                            for (i = 0; i < results.length; i++) {
                                                chociesArray.push(results[i].role_id)
                                            }
                                            return chociesArray;
                                        },
                                        message: 'please select title'
                                    },
                                    {
                                        name: 'manager',
                                        type: 'number',
                                        validate: function(value) {
                                            if (isNaN(value) === false) {
                                                return true;
                                            }
                                            return false;
                                        },
                                        message: 'please enter the new manager id',
                                        default: '1'
                                    }
                                ]).then(function(answer) {
                                    console.log(answer);
                                    console.log(saveName);
                                    connection.query('UPDATE employee SET? WHERE last_name = ?', [{
                                            role_id: answer.role,
                                            manager_id: answer.manager
                                        }, saveName], ),
                                        console.log('-----!!!!employee added!!!!!-----');
                                    start();
                                });
                        })

                })
        })
}
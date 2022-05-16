DROP DATABASE IF EXISTS employeesDB;
CREATE DATABASE employeesDB;

USE employeesDB

CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    PRIMARY KEY (id)
);

CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id VARCHAR(30),
    manager_id INT,
    PRIMARY KEY (id)
);

INSERT INTO department(name)
VALUES('HR'),('Service'),('Engineer'),('Manager');

INSERT INTO role(title,salary,department_id)
VALUES('drone',00001, 1), ('slavelord',75000, 2),('web Maker', 30000, 3);

INSERT INTO employee(first_name, last_name, role_id, manager_id);
VALUES('mmemem', 'iii', 'drone', 2),('UUUU', 'AAA', 'slavelord', 3,)('HEHEHEH', 'THTHTH', 'Web Maker', 3),('jack', 'li', 'drone', 1),('andrew', 'key', 'web Maker', 3);


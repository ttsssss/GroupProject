const express = require('express');
const app = express();
const path = require("path");
var mysql = require("mysql");
var inquirer = require("inquirer");

//connect database//n
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'salon_data'
});

connection.connect(function(err) {
    if (err) throw err;
    runSearch();
});
//prompt message //call inquirer
function runSearch() {
    inquirer.prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Find clients by hairstylist",
                "Find a specific client",
                "Find client number within a specific range",
                "Exit"
            ]
         })
        .then(function (answer) {
        switch(answer.action) {
        case "Find clients by hairstylist":
        hairstylistSearch();
        break;
        case "Find a specific client":
        clientSearch();
        break;
        case "Find client number within a specific range":
        rangeSearch();
        break;
        case "Exit":
        connection.end();
        break;
        }
    });
}    
//funcitons        
function hairstylistSearch() {
    inquirer
      .prompt({
        name: "hairstylist",
        type: "input",
        message: "What hairstylist would you like to search for?"
      })
      .then(function(answer) {
        var query = "SELECT first_name, last_name, hairstylist FROM salon_data___sheet1 WHERE ?";
        connection.query(query, { hairstylist: answer.hairstylist }, function(err, res) {
          if (err) throw err;
          for (var i = 0; i < res.length; i++) {
            console.log("first_name: " + res[i].first_name + " || last_name: " + res[i].last_name);
          }
          runSearch();
        });
      });
  }
  function clientSearch() {
    inquirer
      .prompt({
        name: "client",
        type: "input",
        message: "What client would you like to look for?"
      })
      .then(function(answer) {
        console.log(answer.client);
        connection.query("SELECT first_name, last_name, phone_number, email FROM salon_data___sheet1 WHERE ?", { first_name: answer.client }, function(err, res) {
          if (err) throw err;
          console.log(
            "First Name: " +
              res[0].first_name +
              " || Last Name: " +
              res[0].last_name +
              " || Phone Number: " +
              res[0].phone_number +
              " || Email: " +
              res[0].email
          );
          runSearch();
        });
      });
  }
  function rangeSearch() {
    inquirer
      .prompt([
        {
          name: "start",
          type: "input",
          message: "Enter starting client number: ",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
          name: "end",
          type: "input",
          message: "Enter ending client number: ",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function(answer) {
        var query = "SELECT first_name, last_name, phone_number, service_type FROM salon_data WHERE client_id BETWEEN ? AND ?";
        connection.query(query, [answer.start, answer.end], function(err, res) {
          if (err) throw err;
          for (var i = 0; i < res.length; i++) {
            console.log(
              "First name: " +
                res[i].first_name +
                " || Last name: " +
                res[i].last_name +
                " || Phone: " +
                res[i].phone_number +
                " || Service: " +
                res[i].service_type
            );
          }
          runSearch();
        });
      });
  }

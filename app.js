
const express = require('express');
const app = express();
const path = require("path");
var mysql = require("mysql");
var inquirer = require("inquirer");

var PORT=8080;


//connect database//n
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dr274178',
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
                "Find songs by artist",
                "Find all artists who appear more than once",
                "Find client number within a specific range",
                "Search for a specific song",
                "Exit"
            ]
         })
        .then(function (answer) {
        switch(answer.action) {
        case "Find songs by artist":
        artistSearch();
        break;
        case "Find all artists who appear more than once":
        multiSearch();
        break;
        case "Find client number within a specific range":
        rangeSearch();
        break;
        case "Search for a specific song":
        songSearch();
        break;
        case "Exit":
        connection.end();
        break;
        }
    });
}    
//funcitons        
function artistSearch() {
    inquirer
      .prompt({
        name: "artist",
        type: "input",
        message: "What artist would you like to search for?"
      })
      .then(function(answer) {
        var query = "SELECT position, song, year FROM top5000 WHERE ?";
        connection.query(query, { artist: answer.artist }, function(err, res) {
          if (err) throw err;
          for (var i = 0; i < res.length; i++) {
            console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
          }
          runSearch();
        });
      });
  }
  function multiSearch() {
    var query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
    connection.query(query, function(err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].artist);
      }
      runSearch();
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
  function songSearch() {
    inquirer
      .prompt({
        name: "song",
        type: "input",
        message: "What song would you like to look for?"
      })
      .then(function(answer) {
        console.log(answer.song);
        connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function(err, res) {
          if (err) throw err;
          console.log(
            "Position: " +
              res[0].position +
              " || Song: " +
              res[0].song +
              " || Artist: " +
              res[0].artist +
              " || Year: " +
              res[0].year
          );
          runSearch();
        });
      });
  }
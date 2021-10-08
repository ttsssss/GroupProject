var mysql = require("mysql");
var inquirer = require("inquirer");

//connect database//
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
                "Find clients within a specific date range",
                "Search for a specific client",
                "Exit"
            ]
         })
        .then(function (answer) {
        switch(answer.action) {
        case "Find clients by hairstylist":
        hairstylistSearch();
        break;
        case "Find data within a specific range":
        rangeSearch();
        break;
        case "Search for a specific client":
        clientSearch();
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

  function rangeSearch() {
    inquirer
      .prompt([
        {
          name: "start",
          type: "input",
          message: "Enter starting position: ",
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
          message: "Enter ending position: ",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function(answer) {
        var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
        connection.query(query, [answer.start, answer.end], function(err, res) {
          if (err) throw err;
          for (var i = 0; i < res.length; i++) {
            console.log(
              "Position: " +
                res[i].position +
                " || Song: " +
                res[i].song +
                " || Artist: " +
                res[i].artist +
                " || Year: " +
                res[i].year
            );
          }
          runSearch();
        });
      });
  }
  function clientSearch() {
    inquirer
      .prompt({
        name: "first_name",
        type: "input",
        message: "What client would you like to look for?"
      })
      .then(function(answer) {
        console.log(answer.first_name);
        connection.query("SELECT first_name, last_name, phone_number, email FROM salon_data___sheet1 WHERE ?", { first_name: answer.first_name }, function(err, res) {
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



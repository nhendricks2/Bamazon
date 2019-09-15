var mysql = require('mysql');
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'bamazon'
});

// function display (){
connection.connect();
// connection.query('SELECT * FROM products', function (error, results, fields) {
//   if (error) throw error;
//   console.table(results);

// });
inquirer
  .prompt([
    {
      name: "itemId",
      type: "input",
      message:"What is the ID of the product you would like to buy?"
    },
    {
      name: "units",
      type: "input",
      message: "how many units of the product would you like to buy?"
    }
  ]) .then(function(answer1) {
    
      var selection = answer1.itemId;
      connection.query("SELECT * FROM products WHERE Id=?", selection, function (err,res) {
        if (err) throw err;
        if (res.length === 0) {
          console.log(
            "That Product doesn't exist, Please enter a Product Id from the list above"
          );
        
          shopping();
        } else {
          inquirer
            .prompt({
              name: "quantity",
              type: "input",
              message: "How many items woul you like to purchase?"
            })
            .then(function (answer2) {
              var quantity = answer2.quantity;
              if (quantity > res[0].stock_quantity) {
                console.log(
                  "Our Apologies we only have " +
                  res[0].stock_quantity +
                  " items of the product selected"
                );
                shopping();
              } else {
                console.log("");
                console.log(res[0].products_name + " purchased");
                console.log(quantity + " qty @ $" + res[0].price);

                var newQuantity = res[0].stock_quantity - quantity;
                connection.query(
                  "UPDATE products SET stock_quantity = " +
                  newQuantity +
                  " WHERE id = " +
                  res[0].id,
                  function (err, resUpdate) {
                    if (err) throw err;
                    console.log("");
                    console.log("Your Order has been Processed");
                    console.log("");
                    connection.end();
                  });

                display();
            
                
                }
              });
            }})});
              
      
  

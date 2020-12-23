#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Category = require('./models/category')
var Item = require('./models/item')



var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = []
var items = []


function categoryCreate(name,description, cb) {
  var category = new Category({ name: name, description: description });
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category);
  }   );
}

function itemCreate(name, description, category, price, number_in_stock, cb) {
  itemdetail = { 
    name: name,
    description: description,
    price: price,
    number_in_stock: number_in_stock,
  } 
  if (category != false) itemdetail.category = category;   
  var item = new Item(itemdetail);    
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}





function createCategories(cb) {
    async.series([
        function(callback) {
          categoryCreate('Vehicles', 'Cars, trucks, motorcycles..', callback);
        },
        function(callback) {
          categoryCreate('Tools', 'Hammers, screwdrivers, nails...', callback);
        },
        function(callback) {
          categoryCreate('Appliances', 'Washing machines, kitchen appliances...', callback);
        },
        function(callback) {
          categoryCreate('Books', 'Novels, textbooks, poetry...',callback);
        },
        function(callback) {
          categoryCreate('Game consoles', 'PC, Nintendo, PS4, PS5...', callback);
        }
        ],
        // optional callback
        cb);
}


function createItems(cb) {
    async.parallel([
        function(callback) {
          itemCreate('BMW', '1 SERIES, 120KW 2008', categories[0], 4000, 1, callback);
        },
        function(callback) {
          itemCreate("Mercedes", 'C Class, 140KW 2005', categories[0], 3500, 3, callback);
        },
        function(callback) {
          itemCreate("PS5", 'Sony Play Station 5',  categories[4], 500, 10, callback);
        },
        function(callback) {
          itemCreate("Apes and Angels", "Humankind headed out to the stars not for conquest....", categories[3], 10, 33, callback);
        },
        function(callback) {
          itemCreate("Death Wave","In Ben Bova's previous novel New Earth, Jordan Kell led...", categories[3], 8, 5, callback);
        },
        function(callback) {
            itemCreate("Washing Machine", 'Samsung 5kW',  categories[2], 590, 4, callback);
        },
        function(callback) {
            itemCreate("Hammer", 'Wooden handle',  categories[1], 10, 11, callback);
        }
        ],
        // optional callback
        cb);
}





async.series([
    createCategories,
    createItems,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('BOOKInstances: ');
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});

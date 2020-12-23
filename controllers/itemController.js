const Item = require("../models/item")
const Category = require("../models/category")

var async = require('async');
// Display list of all Authors.
exports.index = function(req, res) {

    async.parallel({
        item_count: function(callback) {
            Item.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        category_count: function(callback) {
            Category.countDocuments({}, callback);
        },
    }, function(err, results) {
        res.render('index', { title: 'InventoryApp Home', error: err, data: results });
    });
};
exports.item_list = function(req, res, next) {

    Item.find({}, 'name description')
      .populate('category')
      .exec(function (err, list_items) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('item_list', { title: 'Item List', item_list: list_items });
      });
  
  };

// Display detail page for a specific item.
exports.item_detail = function(req, res, next) {

    async.parallel({
        item: function(callback) {

            Item.findById(req.params.id)
              .populate('category')
              .exec(callback);
        },
        
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.item==null) { // No results.
            var err = new Error('item not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('item_detail', { title: results.item.name, item: results.item} );
    });

};

// Display item create form on GET.
exports.item_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: item create GET');
};

// Handle item create on POST.
exports.item_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: item create POST');
};

// Display item delete form on GET.
exports.item_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: item delete GET');
};

// Handle item delete on POST.
exports.item_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: item delete POST');
};

// Display item update form on GET.
exports.item_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: item update GET');
};

// Handle item update on POST.
exports.item_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: item update POST');
};
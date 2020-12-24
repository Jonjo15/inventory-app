const Item = require("../models/item")
const Category = require("../models/category")
const { body,validationResult } = require('express-validator');

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
exports.item_create_get = function(req, res, next) {

    // Get all authors and genres, which we can use for adding to our item.
    async.parallel({
        items: function(callback) {
            Item.find(callback);
        },
        categories: function(callback) {
            Category.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('item_form', { title: 'Create Item', items: results.items, categories: results.categories });
    });

};

// Handle item create on POST.
exports.item_create_post = [

    // Validate and sanitise fields.
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('description', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('price', 'Price must not be empty or zero.').trim().isLength({ min: 1 }).escape(),
    body('number_in_stock', 'number_in_stock must not be empty or zero').trim().isLength({ min: 1 }).escape(),
    body('category', 'Category must not be empty.').trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a item object with escaped and trimmed data.
        var item = new Item(
          { name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock,
            category: req.body.category
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and categories for form.
            async.parallel({
                categories: function(callback) {
                    Category.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                res.render('item_form', { title: 'Create Item', categories:results.categories, item: item, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save item.
            item.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new item record.
                   res.redirect(item.url);
                });
        }
    }
];

// Display item delete form on GET.
exports.item_delete_get = function(req, res, next) {
    Item.findById(req.params.id).exec(function (err, item) {
        if (err) { return next(err)}

        res.render("item_delete", {title: "Delete Item", item: item})
    })
  };

// Handle item delete on POST.
exports.item_delete_post = function(req, res, next) {
    Item.findByIdAndRemove(req.body.itemid, function deleteInstance(err) {
        if (err) {return next(err)}
        res.redirect("/catalog/items")
    })
};

// Display item update form on GET.
exports.item_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: item update GET');
};

// Handle item update on POST.
exports.item_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: item update POST');
};
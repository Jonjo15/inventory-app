var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
  {
    name: {type: String, required: true, maxlength: 100},
    description: {type: String, required: true, maxlength: 100},
    category: {type: Schema.Types.ObjectId, ref: "Category", required: true},
    price: {type: Number, required: true},
    number_in_stock: {type: Number, required: true}
  }
);

// Virtual for author's full name
ItemSchema
.virtual('url')
.get(function () {
  return "/catalog/item/" + this._id;
});


//Export model
module.exports = mongoose.model('Item', ItemSchema);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myschema = new Schema({
    product_name: String,
    product_details: String,
    product_price: String,
    product_Image: String,
    _subcategory:
        {
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'subcategory'
        }
});

module.exports = mongoose.model('product', myschema);
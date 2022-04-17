var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myschema = new Schema({
    product_name: String,
    product_price: String,
    product_Image: String,
    _user:[
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'user'
    }],
    _product:[
        {
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'product'
        }] 
});

module.exports = mongoose.model('cart', myschema);
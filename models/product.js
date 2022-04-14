const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'product must have name']
    },
    img: {
        type: String,
        unique: true,
        required: [true, 'product must have image']
    },
    desc: {
        type: String,
        required: [true, 'product must have description']
    },
    price: {
        type: Number,
        required: [true, 'product must have price']
    },
    cat: {
        type: Array,
        required: [true, 'product belong to categories']
    },
    dis: {
        type: Number
    }
})

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
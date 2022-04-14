const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'Product'
                },
                quantity: {
                    type: Number
                }
            }

        ],
        totalAmount: {
            type: Number
        }
    },
    { timestamps: true }
);

CartSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'products.product',
        select: 'name price img dis'
    })
    next()
})
const Cart = mongoose.model('Cart', CartSchema)

module.exports = Cart



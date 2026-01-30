const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User'
    },
    products:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Product'
    }]
})

module.exports = mongoose.model('Cart',CartSchema)
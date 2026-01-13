const mongoose = require('mongoose')

const product = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
    }],
    pType:{
        type:String,
        enum:['hamper','product','candle'],
        required:true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        // required: true,
    },
    discount: {
        type: Number,
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    slug: {
        type: String,
        unique: true,
    },

    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',

    },
    updatedHistory:[{ updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',

    }, updatedAt:{
        type:Date,
        default:Date.now,
    }}]
})  

module.exports = mongoose.model('Product', product)
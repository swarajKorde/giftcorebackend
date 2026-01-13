const mongoose = require('mongoose');

const oderSchema = new mongoose.Schema({
    // products:[{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'Product',
        
    // }], // we are not selling the products individually but as hampers >> but if we do then uncomment this
    product:{
        type:mongoose.Schema.Types.ObjectId,
        
       
    },
    itemType:{
        type:String,
        enum:['product','hamper','candle'],
        
    },
    totalPrice:{
        type:Number,
        required:true,
    },
    totalItems:{
        type:Number,
        default:1,
        required:true, // total number of hamper default is 1
    },
    status:{
        type:String,
        enum:['pending','shipped','delivered','cancelled'],
        // required:true, 
    },
    createdAt:{ type: Date, default: Date.now },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    updatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});

module.exports = mongoose.model('Oder', oderSchema); 
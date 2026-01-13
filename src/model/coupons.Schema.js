const mongoose = require('mongoose');


const CouponSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    code:{
        type:String,
        required:true,
        unique:true
    } 
})
module.exports = mongoose.model('Coupon',CouponSchema)
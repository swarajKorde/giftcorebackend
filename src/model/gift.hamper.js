const mongoose =require('mongoose')

const hamperSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true,
    },
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        // required:true,
    }],
    price:{
        type:Number,
    },
    images:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Image',
    }],
    createdAt:{ type: Date, default: Date.now },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    updatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    updatedHistory:[{updatedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'}, updatedAt:{type:Date,default:Date.now}}]

})

module.exports = mongoose.model('Hamper', hamperSchema) 
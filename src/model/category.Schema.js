const mongoose = require('mongoose');


const CategorySchema = new mongoose.Schema({
    name: {
        type: String,   
        required: true,
        unique: true,
    },
    image:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Image'
        }
    ],
    hampers: [
        { 
            type: mongoose.Schema.Types.ObjectId,   
            ref: 'Product',
        },
    ],
    description: { 
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',    
        required: true,
    },
    updateHistory: [
        {
            updatedBy: {    
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            updatedAt: {
                type: Date,
                default: Date.now,
            },
            changes: {
                type: String,
            },
        },
    ],
}); 

module.exports = mongoose.model('Category',CategorySchema)
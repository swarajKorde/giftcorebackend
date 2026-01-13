const mongoose = require('mongoose');


const ImageSchema = new mongoose.Schema({
    name:{
        type: String,   
        required: true,
        
    },
    url: {
        type: String,   
        required: true,
        unique: true,
    },
    description: { 
        type: String,
        required: false,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
    fileId:{
        type: String,
        required: true,
        unique: true,
    }
});
module.exports = mongoose.model('Image',ImageSchema)
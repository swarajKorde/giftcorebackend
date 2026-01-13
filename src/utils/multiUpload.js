const uploadImage =require('../services/cloud.service');
const Image = require('../model/image.Schema');

async function multiUpload(files) {
    const images=[]
    for(const file of files){
        const image = uploadImage(file.buffer,file.originalname)
        
    }
}
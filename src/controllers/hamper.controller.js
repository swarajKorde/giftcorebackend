const mongoose = require('mongoose');
const Hamper = require('../model/gift.hamper.js');
const uploadImage = require('../services/cloud.service');

exports.getAllHamper = async (req, res) => {
    try {
        // Logic to get all hampers
        const hampers = await Hamper.find();
        res.status(200).json({ message: 'Get all hampers' , data: hampers});
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }   
};

exports.createHamper = async (req, res) => {
    try {
        // Logic to create a hamper
        const hamper = req.body;
        const imageIds = await uploadImage(req.files);
        const newHamper = await Hamper.create({
            ...hamper,
            createdBy:req.user.id,
            images:imageIds,
        });

        res.status(201).json({ message: 'Hamper created successfully', data: newHamper });
        console.log("Creating hamper:", hamper);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.updateHamper = async (req, res) => {
    try {
        // Logic to update a hamper
        const { id } = req.params;
        const hamper = req.body;

        // checks if the hamper exists
        const isHamperExist = await Hamper.findOne({ _id: id });
        if (!isHamperExist) {
            return res.status(404).json({ message: 'Hamper not found' });
        }  ;
        
        // updating the hamper images // imagesToKeep contains ids of images to be retained
        const {imagesToKeep} = req.body;
        //new images to add
        const imagesId = await uploadImage(req.files);
        

        // updating the hamper in mongodb
        const updatedHamper = await Hamper.findOneAndUpdate(
            { _id: id }, {
            $set: {
                ...hamper,
                updatedBy: req.user.id,
                images:[...imagesToKeep,...imagesId]  // if images are to be updated
            },
            $push:{
                updatedHistory:{
                    updatedBy:req.user.id,
                    updatedAt:Date.now(),
                }
            }
        }
        );
        console.log(`Updating hamper ${id} with data:`, hamper);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};  
exports.deleteHamper = async (req, res) => {
    try {
        // Logic to delete a hamper 
        const { id } = req.params;
        
        const deletedHamper = await Hamper.findOneAndDelete({ _id: id });
        console.log(`Deleting hamper with id: ${id}`);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const mongoose = require('mongoose');
const Product = require('../model/product.Schema');
const Image = require('../model/image.Schema');
const { uploadImage, deleteImagesFromCloud } = require('../services/cloud.service');

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('image').exec();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get product by slug
exports.getProductById = async (req, res) => {
    const { id } = req.params;
    console.log("Fetching product with ID:", id);
    try { 
        const product = await Product.findOne({ _id: id }).populate('image');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        console.log(product)
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
 
// Create a new product
exports.createProduct = async (req, res) => {
    try {
        //user who added the product
        // console.log(req.file);
        // const { _id } = req.body;
        // const isProductExist = await Product.findOne({ _id });
        // if (isProductExist) {
        //     return res.status(400).json({ message: 'Product with this ID already exists' });
        // }
        
        const imageResponse = await uploadImage(req.files);
        console.log("Image uploaded to ImageKit:", imageResponse);
        const product = req.body;
        const newProduct = await Product.create({
            ...product,
            createdBy: req.user.id,
            createdAt: new Date(),
            image: imageResponse,

        });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    try {
        // the id will be sent from url so we will get in in params 
        const { _id } = req.params;

        // i think we dont need this part now cause below we are checing the existence of product
        // checking if the product exists before updating   
        // const isProductExist = await Product.findOne({ product_id })
        // if (!isProductExist) {
        //     return res.status(404).json({ message: 'Product not found' });
        // };
        // req.body must have imagesToKeep array and new images in req.files
        const { imagesToKeep } = req.body;
        //new images to add
        const imagesId = await uploadImage(req.files);

        const updatedProduct = await Product.findOneAndUpdate(
            { _id }, {
            $set: {
                ...req.body,
                updatedBy: req.user.id,
                iamge: [...imagesToKeep, ...imagesId]
            },
            $push: {
                updatedHistory: {
                    updatedBy: req.user.id,
                    updatedAt: new Date(),
                }
            }
        },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        console.log("Deleting product with ID:", id);

        const deletedProduct = await Product.findOneAndDelete({ _id: id });
        if (!deletedProduct) {
            console.log("Product not found for deletion:", id);
            return res.status(404).json({ message: 'Product not found' });
        }
        // Deleting associated images from cloud
        const imageFileIds = await Image.find({ _id: { $in: deletedProduct.image } }).select('fileId -_id');
        const fileIds = imageFileIds.map(img => img.fileId);
        await deleteImagesFromCloud(fileIds);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {

        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


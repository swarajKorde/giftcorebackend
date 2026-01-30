const Category = require('../model/category.Schema');
const { uploadImage, deleteImagesFromCloud } = require('../services/cloud.service');
const Image = require('../model/image.Schema');
const { json } = require('express');

// Get all categories   
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('image');
        console.log(categories)   
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Create a new Category   
exports.createCategory = async (req, res) => {
    try {
        // console.log(req.body)
        const { name, description, } = req.body;
        // console.log(req.files)
        const imageIds = await uploadImage(req.files)
        const newCategory = await Category.create({
            ...req.body,
            image: imageIds,
            createdBy: req.user.id,
            createdAt: new Date(),
        });
        console.log(newCategory)
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
// Update a Category
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    // console.log('i am in the update category') 
    // console.log('image file',req.files)
    console.log(req.body)
    try {
        const {name,description}= req.body
        const imageIdtoRemove = JSON.parse(req.body.imagesToRemove || '[]')

        // only remove img from cloud if the imageIdtoRemove exist

        if (imageIdtoRemove.length > 0) {

            const fileIds = (
                await Image.find(
                    { _id: { $in: imageIdtoRemove } },
                    { fileId: 1, _id: 0 }
                )
            ).map(img => img.fileId);

           console.log(await deleteImagesFromCloud(fileIds)) 

            const removedIdfromTheCategory = await Category.findByIdAndUpdate({ _id: id },
                { $pull: { image: { $in: imageIdtoRemove } } }
            )
        }
        // if new image to add exist

        let newImageIds=[]
        if(req.files && req.files.length>0){
            newImageIds = await uploadImage(req.files) // returns image ids
        }

        const updateCategory = await Category.findByIdAndUpdate(id, {
            $set: {
                name: name,
                description: description,
                hampers: req.body.hampers
            },

            $push: {
                image: { $each: newImageIds },

                updateHistory: {
                    updatedBy: req.user._id,
                    updatedAt: new Date()
                }
            }
        }, { new: true }
        )
        console.log('all updated category',updateCategory)
        res.status(200).json({ msg: 'category updated sucessfully' })

        console.log()

        //     let newImagesToUpload = await req.files || []
        //     let newImagesId=[]
        //     if(newImagesToUpload.length>0){
        //          newImagesId = await uploadImage(newImagesToUpload)
        //     }
        //     const updateCategory = await Category.findByIdAndUpdate(id,{
        //         $set:{
        //             name:name,
        //             description:description,
        //             hampers:req.body.hampers
        //         },

        //         $push:{
        //             image:{$each:newImagesId},

        //             updateHistory:{
        //                 updatedBy:req.user._id,
        //                 updatedAt:new Date()
        //             }
        //         }
        //     },{new:true}
        // )
        //     // console.log('all updated category',updateCategory)
        //     res.status(200).json({msg:'category updated sucessfully'})
    } catch (error) {
        console.log('error message', error.message)
        res.status(500).json({ msg: error.message })
    }

};

// Get Category by ID
exports.getCategoryById = async (req, res) => {
    const { id } = req.params;
    console.log(req.params)
    console.log("Fetching Category with ID:", id);
    try {
        const CategoryData = await Category.findOne({ _id: id }).populate('image')
        // console.log(CategoryData)
        if (!CategoryData) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(CategoryData);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// get category by id variations 
// to show the hampers of that category

exports.getCategoryProductsById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        const categoryHampers = await Category.findOne( {_id:id }).select('hampers').populate({
            path: 'hampers',
            populate: {
                path: 'image'
            }
        })
         console.log(categoryHampers)
        // const data = categoryHampers.hampers
        res.status(200).json(categoryHampers.hampers)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


// Delete a Category
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // 1️⃣ Find category + populate images
        const category = await Category.findById(id).populate('image');

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // 2️⃣ Collect ImageKit fileIds
        const fileIds = category.image.map(img => img.fileId);

        // 3️⃣ Delete images from ImageKit + Image collection
        if (fileIds.length > 0) {
            await deleteImagesFromCloud(fileIds);
        }

        // 4️⃣ Remove category reference from products (KEEP PRODUCTS)


        // 5️⃣ Delete category
        await Category.findByIdAndDelete(id);

        res.status(200).json({ message: 'Category deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
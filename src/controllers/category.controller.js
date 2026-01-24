const Category = require('../model/category.Schema');
const { uploadImage,deleteImagesFromCloud } = require('../services/cloud.service');

// Get all categories   
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('image');
        // console.log(categories)   
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
            image:imageIds,
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
    const { _id } = req.params;
    try {   
        const updatedCategory = await Category.findOneAndUpdate(
            { _id }, {
            $set: {
                ...req.body,    
                updatedBy: req.user.id, 
            },  
            $push: {
                
                updateHistory: {
                    updatedBy: req.user.id,
                    updatedAt: new Date(),
                    changes: JSON.stringify(req.body),
                },
            },
        });
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}; 
 
// Get Category by ID
exports.getCategoryById = async (req, res) => {
    const { id } = req.params;  
    console.log(req.params)
    console.log("Fetching Category with ID:", id);
    try {
        const CategoryData = await Category.findOne({ _id: id }).populate({
            path:'hampers',
            populate:{
                path:'image'
            }
            });
        if (!CategoryData) {
            return res.status(404).json({ message: 'Category not found' });
        } 
        console.log(CategoryData.hampers)          
        res.status(200).json(CategoryData.hampers); 
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }   
}; 
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
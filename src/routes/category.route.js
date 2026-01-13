const express = require('express');
const router = express.Router();
const multer =require('multer')
const upload = multer(multer.memoryStorage())


// controllers  
const {getAllCategories, createCategory, updateCategory, deleteCategory, getCategoryById} = require('../controllers/category.controller.js');

//middleware
const {authCheck} = require('../middleware/authCheck.js');
const {adminCheck} = require('../middleware/adminCheck.js')
router.get('/', getAllCategories);
router.get('/:id',getCategoryById);
router.post('/', adminCheck,upload.array('image',3),createCategory);
router.put('/:id',authCheck, updateCategory);
router.delete('/:id',authCheck, deleteCategory); //

module.exports=router;   
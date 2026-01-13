const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(multer.memoryStorage());

// controllers
const {getAllProducts, createProduct, updateProduct, deleteProduct, getProductById} = require('../controllers/product.controller.js');
//middleware
const {authCheck} = require('../middleware/authCheck.js');
const {adminCheck}=require('../middleware/adminCheck.js')

router.get('/', getAllProducts);
router.get('/:id',getProductById);
router.post('/', adminCheck,upload.array('image',3),createProduct);
router.put('/:id',authCheck,upload.array('image',3), updateProduct);
router.delete('/:id',authCheck, deleteProduct); 

module.exports = router;    
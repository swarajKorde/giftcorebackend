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
        // console.log(product)
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
    const { id } = req.params;

    console.log('Update product:', id);

    // 1️⃣ Parse removed ImageKit fileIds
    const removedFileIds = JSON.parse(req.body.removedFileIds || '[]');
    console.log('Removed fileIds:', removedFileIds);

    let imageObjectIdsToRemove = [];

    // 2️⃣ Find Image ObjectIds using fileId
    if (removedFileIds.length > 0) {
      const images = await Image.find(
        { fileId: { $in: removedFileIds } },
        { _id: 1, fileId: 1 }
      );

      imageObjectIdsToRemove = images.map(img => img._id);

      // 3️⃣ Delete from ImageKit + Image collection
      await deleteImagesFromCloud(images.map(img => img.fileId));
    }

    // 4️⃣ REMOVE image ObjectIds from Product (FIRST UPDATE)
    if (imageObjectIdsToRemove.length > 0) {
      await Product.findByIdAndUpdate(id, {
        $pull: { image: { $in: imageObjectIdsToRemove } }
      });
    }

    // 5️⃣ Upload new images (optional)
    let newImageIds = [];
    if (req.files && req.files.length > 0) {
      newImageIds = await uploadImage(req.files); // returns Image _ids
    }

    // 6️⃣ ADD new images + update fields (SECOND UPDATE)
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $push: {
          image: { $each: newImageIds },
          updateHistory: {
            updatedBy: req.user.id,
            updatedAt: new Date(),
          }
        },
        $set: {
          name: req.body.name,
          price: req.body.price,
          discount: req.body.discount,
          category: req.body.category,
          pType: req.body.pType,
          slug: req.body.slug,
          updatedBy: req.user.id,
        }
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find product first
    const product = await Product.findById(id).populate('image');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // 2️⃣ Collect ImageKit fileIds
    const fileIds = product.image.map(img => img.fileId);

    // 3️⃣ Delete from ImageKit + Image collection
    if (fileIds.length > 0) {
      await deleteImagesFromCloud(fileIds);
    }

    // 4️⃣ Delete product
    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



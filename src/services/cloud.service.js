// import ImageKit from '@imagekit/nodejs';
const ImageKit = require('imagekit');
const Image = require('../model/image.Schema');

const Imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
});

// const response = await client.files.upload({
//   file: fs.createReadStream('path/to/file'),
//   fileName: 'file-name.jpg',
// });
const uploadImage = async (files) => {
  try {
    const imagesIds = [];
    for (const file of files) {
      const upload = await Imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
      });
      // uploading those images in mongodb
      const image = await Image.create({
        name: upload.name,
        url: upload.url,
        fileId: upload.fileId,
      }); 
      imagesIds.push(image._id);
    }

    return imagesIds;
  } catch (error) {
    console.error('Error uploading image to ImageKit:', error);
    throw error;
  }
};

const deleteImagesFromCloud = async (fileIds = []) => {
  for (const fileId of fileIds) {
    try {
      await new Promise((resolve, reject) => {
        Imagekit.deleteFile(fileId, (error, result) => {
          if (error) return reject(error);
          console.log("ImageKit delete result:", result);
          resolve(result);
        });
      });

      // delete from MongoDB ONLY after cloud delete
      await Image.findOneAndDelete({ fileId });

    } catch (error) {
      console.error(
        "Error deleting image from ImageKit:",
        error.message || error
      );
      throw error;
    }
  }
};

// const deleteImagesFromCloud = async (fileIds) => {
//   try { 
//     for (const fileId of fileIds) {
//       await Imagekit.deleteFile(fileId, (error, result) => {
//         console.log('image kit delete result', result)
//         if (error) return reject(error);
//         resolve(result);
//       });
//       // Also remove from MongoDB
//       await Image.findOneAndDelete({ fileId });
//     }
//   } catch (error) {
//     console.error('Error deleting image from ImageKit:', error.message);
//     throw error;
//   }
// }

console.log(exports.uploadImage);
module.exports = { uploadImage, deleteImagesFromCloud };

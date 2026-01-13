const express   = require('express');
const router    = express.Router();
const multer = require('multer');
const upload = multer(multer.memoryStorage());
// controllers
const {getAllHamper, createHamper, updateHamper, deleteHamper} = require('../controllers/hamper.controller.js');
//middleware
const {authCheck} = require('../middleware/authCheck.js');


router.get('/', getAllHamper);
// router.get('/:id',getHampersById)
router.post('/', authCheck, createHamper);
router.put('/:id', authCheck, updateHamper); 
router.delete('/:id', authCheck, deleteHamper);

module.exports = router; 


// add multer middleware for file uploads when needed <<- pending
// and another middleware for admin check if needed <<- pending 
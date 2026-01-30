const express = require('express')
const { getAllCartData ,getCartById ,AddAndUpdateCart,deleteCartItemById,getCartDataForCartPage} = require('../controllers/cart.controller')
const { authCheck } = require('../middleware/authCheck')
const router  = express.Router()


router.get('/',authCheck,getAllCartData)
router.get('/forCartPage',authCheck,getCartDataForCartPage)
router.get('/byId',authCheck,getCartById)
router.post('/',authCheck,AddAndUpdateCart)
router.delete('/',authCheck,deleteCartItemById)

module.exports=router;
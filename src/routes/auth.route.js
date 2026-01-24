const express = require('express')
const router= express.Router()
const {createUser,login,logout,getMe,getUser} =require('../controllers/auth.controller')
const { adminCheck } = require('../middleware/adminCheck')
const { authCheck } = require('../middleware/authCheck')

router.get('/login',(req,res)=>{
    res.send('hi you got this')
})
router.post('/login',login)
router.post('/signup',createUser)
router.get('/logout',logout)
router.get('/me/admin',adminCheck,getMe)
router.get('/me/user',authCheck,getUser)
module.exports = router; 
  
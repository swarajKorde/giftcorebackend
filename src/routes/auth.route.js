const express = require('express')
const router= express.Router()
const {createUser,login,logout} =require('../controllers/auth.controller')

router.get('/login',(req,res)=>{
    res.send('hi you got this')
})
router.post('/login',login)
router.post('/signup',createUser)
router.get('/logout',logout)
module.exports = router;
 
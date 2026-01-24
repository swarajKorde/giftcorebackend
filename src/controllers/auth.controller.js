const User = require('../model/user.model.js')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {

    const { email, password } = req.body
    console.log(email, password)
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ msg: 'user does not exist' })
    }
    if (user.password !== password) {
        return res.status(400).send('wrong credentials')
    }
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
    });

    // res.cookie("token", token) 
    return res.status(200).json({
        msg: "login successfully",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        }

    })
}

const createUser = async (req, res) => {
    try {
        const { name, email, password, role, createdAt } = req.body
        // console.log(req.body)
        // you are finding One so FindOne
        const isPresent = await User.findOne({ email })
        if (isPresent) {

            return res.status(400).send('user already exist')
        }
        const newUser = await User.create({ name, email, password, role, createdAt })
        const payload = {
            id: newUser._id,
            email: newUser.email,
            role: newUser.role
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '7d'
        })
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
        });

        console.log(newUser)
        return res.status(200).send('user created successfully')
    } catch (error) {
        return res.status(400).json({
            msg: "User creation failed",
            error: error.message
        });
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
        })
        return res.status(200).json({ msg: "logged out" })
    }
    catch (error) {
        return res.status(400).json({
            msg: "err occured",
            error: error
        })
    } 
}

const getMe = async (req, res)=>{
    try{
        console.log('request reached')
        console.log('this is the user:',req.user)
        return res.status(200).json('authentication successful')
    }catch(error){
        return res.status(500).json({msg:'server error', error: error.message})
    }
}

const getUser = async (req,res)=>{
    try{
        console.log('user request reached here')
        return res.status(200).json({user:req.user})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({msg:'server error', error: error.message})
    }
}
module.exports = { createUser, login, logout, getMe , getUser }
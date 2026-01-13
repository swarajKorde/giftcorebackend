const User = require('../model/user.model.js')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
    
    const { email, password } = req.body
    console.log(email,password)
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({msg:'user does not exist'})
    }
    if (user.password !== password) {
        return res.status(400).send('wrong credentials')
    }
    const payload = {
        id: user._id,
        email: user.email,
        role:user.role
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
    res.cookie("token", token, {
        httpOnly: true, 
         sameSite: "lax",   //  for the localhost       
        secure:false       // must be false on http true on https 

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
            role:newUser.role
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '7d'
        })
        res.cookie("token", token, {
            httpOnly: true,       // ⛔ Prevent JS access (XSS safe)
            sameSite: "lax",          
            secure:false   
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
        res.clearCookie('token',{
            httpOnly: true, 
        })
        return res.status(200).json({msg:"logged out"})
    }
    catch (error) {
        return res.status(400).json({
            msg:"err occured",
            error:error
        })
    }
}

module.exports = { createUser, login ,logout}
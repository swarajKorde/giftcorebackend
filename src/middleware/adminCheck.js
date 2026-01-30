const jwt = require('jsonwebtoken');

const adminCheck = async (req, res, next) => {
    const token = req.cookies.token;
    
    // console.log('this is req from admin check',req)
    // console.log('this is token from admin check ',token)
    
    try {
        
        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }
        // if(req.user.role !== 'admin'){
        //     return res.status(403).json({ message: "Access denied, admin only" }); // uncommnet when done testing
        // }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        if(!decoded.role=='admin'){
            return res.status(401).json({msg:'you aint no admin sorry'})
        }
        req.user = decoded;
        // console.log("Authenticated User:", req.user);
        next()
    } catch (error) {
        console.error(error.message);  
        return res.status(500).json({ message: "Server Error", error: error.message });
    }


}

module.exports = {
    adminCheck
}
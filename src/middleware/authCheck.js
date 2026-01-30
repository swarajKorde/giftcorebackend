const jwt = require('jsonwebtoken');

const authCheck = async (req, res, next) => {
    const token = req.cookies.token;
    try {
        // console.log('token from authcheck',token)
        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }
        // if(req.user.role !== 'admin'){
        //     return res.status(403).json({ message: "Access denied, admin only" }); // uncommnet when done testing
        // }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded;
        console.log("Authenticated User:", req.user);
        next()
    } catch (error) {
        console.error(error.message); 
        return res.status(500).json({ message: "Server Error", error: error.message });
    }


} 

module.exports = { 
    authCheck
}
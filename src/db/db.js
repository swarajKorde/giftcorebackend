const mongoose = require('mongoose');

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.DB_CONNECT)
        console.log('database Connected')
    } catch (error) {
        console.log('oops the error occured in db',error)
    }
}
module.exports= connectDB
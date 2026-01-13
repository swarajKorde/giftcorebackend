require('dotenv').config()
const express =require('express')
const cookie =require('cookie-parser')
const cors = require('cors')
//routes
const authRoute = require('./routes/auth.route')
const productRoute = require('./routes/product.route')
const hamperRoute = require('./routes/hamper.route')
const categoryRoute = require('./routes/category.route')
// const dotenv =require('dotenv')
// dotenv.config()  ==> even this works 



const app =express()
app.use(
  cors({
    origin:[ "http://localhost:3000","https://www.thegiftcore.in/"],
    credentials: true, // this is required for the cookie and so does the origin of the specific url to set a cookie in
  })
);
app.use(cookie())
app.use(express.json())

// routers
app.use('/api/product',productRoute);
app.use('/api/hamper',hamperRoute);
app.use('/api/auth',authRoute);
app.use('/api/category',categoryRoute)
// app.get("/", (req, res) => {
//   res.send("Server is running 🚀");
// });

module.exports=app;
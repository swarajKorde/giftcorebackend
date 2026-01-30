const Cart = require('../model/cart.Schema')

exports.getAllCartData = async (req, res) => {
    try {
        const userId = req.user._id
        const cartData = await Cart.findOne({user:userId}).populate('products')
        // console.log(cartData.products)
        res.status(200).json(cartData)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

exports.getCartDataForCartPage =async (req,res)=>{
    const userId = req.user._id
    try{
        const CartData = await Cart.findOne({user:userId}).select('products').populate({
            path:'products',
            populate:{
                path:'image'
            }
        })

        // console.log('getCartDataForCartPage',CartData)
        res.status(200).json(CartData)
    }catch(error){
        res.status(500).json(error.message)
    }
}

exports.getCartById = async (req, res) => {
    try {
        const userId = req.user._id
        const CartData = await Cart.findOne({ user: userId }).populate({
            path:'products',
            populate:{
                path:'image'
            }
        })
        // console.log(CartData)
        res.status(200).json(CartData)
    } catch (error) {
        res.status(500).json(error.message)
    } 
}

// exports.addCart = async (req, res) => {
//     try {
//         const { products } = req.body

//         const CartData = await Cart.create({
//             user: req.user._id,
//             products: products
//         })

//         res.status.json('Added to Cart')

//     } catch (error) {
//         res.status(500).json({ msg: error.message })
//     }
// }

exports.AddAndUpdateCart = async (req, res) => {
    console.log("🔥 AddAndUpdateCart controller HIT");
    console.log('this is req body',req.body)
    try {
        const { id } = req.params
        const { products } = req.body
        const userId = req.user._id;
        console.log(products)

        const CartData = await Cart.findOneAndUpdate(
            { user: userId },
            {
                $addToSet: {
                    products: { $each: products }
                }
            },
            { new: true }
        );

        if (!CartData) {
            const CartData = await Cart.create({
                user: req.user._id,
                products: products
            }
        )
            console.log('cart data from add and update',CartData)
           return res.status(200).json('Added to Cart')
        }
        res.status(200).json('cart updated sucessfully')
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ msg: error.message })
    }
}

exports.deleteCartItemById = async (req, res) => {

    try {
        const { id } = req.params
        const userId = req.user._id
        const { productId } = req.body
        console.log('reached in delete',req.body)
        const CartData = await Cart.findOneAndUpdate({ user: userId }, {
            $pull: { products: {$in:productId}},

        }, { new: true })
        console.log(CartData)
        res.status(200).json('cart item deleted sucessfully')
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}
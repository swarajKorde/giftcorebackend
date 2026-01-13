const Order = require('../model/order.model');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const orderData = req.body;
        console.log(req.body);
        const newOrder = await Order.create({
            ...orderData,
            createdBy: req.user.id,
            createdAt: new Date(),
            totalItems:orderData.totalItems,
            totalPrice:orderData.totalPrice,
        });
        res.status(201).json({ message: 'Order created successfully', data: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }  
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json({ message: 'Get all orders', data: orders });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }   
};

// Update an order
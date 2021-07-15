const Order = require('../models/order.model');

// @desc Get users' orders
// @route GET /api/v1/admin/orders
// @access Private
const getAllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find({}).sort('-createdAt').exec();
    res.status(200).json(allOrders);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

// @desc Update user order
// @route PUT /api/v1/admin/orders/:_id
// @access Private
const updateUserOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const updatedUserOrder = await Order.findByIdAndUpdate(
      req.params._id,
      { orderStatus },
      { new: true }
    ).exec();
    updatedUserOrder.SyncToAlgolia();
    res.status(201).json({ updated: true });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

module.exports = {
  getAllOrders,
  updateUserOrderStatus,
};

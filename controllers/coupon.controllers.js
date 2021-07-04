const Coupon = require('../models/coupon.model');
const User = require('../models/user.model');

// @desc Creating coupon
// @route POST /api/v1/coupon
// @access Admin
const createCoupon = async (req, res) => {
  try {
    const { name, expiry, discount } = req.body.coupon;
    const newCoupon = await new Coupon({ name, expiry, discount }).save();
    res.json(newCoupon);
  } catch (error) {
    console.log(error)
    res.status(400).send(error);
  }
};

// @desc Delete coupon
// @route DELETE /api/v1/coupon/:_id
// @access Admin
const deleteCoupon = async (req, res) => {
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(req.params._id).exec();
    res.json(deletedCoupon);
  } catch (error) {
    console.log(error)
    res.status(400).send(error);
  }
};

// @desc Get coupons
// @route GET /api/v1/coupon/
// @access Private
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 }).exec();
    res.json(coupons)
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  createCoupon,
  deleteCoupon,
  getCoupons,
};

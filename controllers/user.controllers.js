const User = require('../models/user.model');
const Coupon = require('../models/coupon.model');
const Cart = require('../models/cart.model');
const mongoose = require('mongoose');

// @desc Add user address
// @route PUT /api/users/address/add
// @access Private
const addUserAddress = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  try {
    const addedAddress = await User.findOneAndUpdate(
      { email: user.email },
      {
        $push: { addresses: { _id: mongoose.Types.ObjectId(), ...req.body } },
      },
      { new: true }
    ).exec();
    addedAddress.SyncToAlgolia();
    res.status(201).json(addedAddress);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

// @desc Update user address
// @route PUT /api/users/address/update/:_id
// @access Private
const updateUserAddress = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  const userAddressToUpdate = user.addresses.find(
    (address) => address._id.toString() === req.params._id.toString()
  );

  try {
    const updatedUserdAddress = await User.findOneAndUpdate(
      {
        addresses: { $elemMatch: userAddressToUpdate },
      },
      {
        $set: {
          'addresses.$': {
            _id: mongoose.Types.ObjectId(req.params._id),
            ...req.body,
          },
        },
      },
      { new: true }
    ).exec();
    updatedUserdAddress.SyncToAlgolia();
    res.status(201).json({ updated: true });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

// @desc Delete user address
// @route DELETE /api/users/address/delete/:_id
// @access Private
const deleteUserAddress = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  const userAddressToDelete = user.addresses.find(
    (address) => address._id.toString() === req.params._id.toString()
  );

  try {
    const deletedUserdAddress = await User.findOneAndUpdate(
      {
        addresses: { $elemMatch: userAddressToDelete },
      },
      {
        $pull: { addresses: { _id: mongoose.Types.ObjectId(req.params._id) } },
      },
      { new: true }
    ).exec();
    deletedUserdAddress.SyncToAlgolia();
    res.status(201).json(deletedUserdAddress);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

// @desc Get user address
// @route GET /api/users/address/:_id
// @access Private
const getUserAddress = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  const requestedUserAddress = user.addresses.find(
    (address) => address._id.toString() === req.params._id.toString()
  );

  if (requestedUserAddress) {
    res.json(requestedUserAddress);
  } else {
    res.status(400).send("Cette adresse n'existe pas.");
  }
};

// @desc Apply user coupon
// @route POST /api/users/coupon
// @access Private
const applyCoupon = async (req, res) => {
  const { coupon } = req.body;
  const requestedCoupon = await Coupon.findOne({ name: coupon }).exec();

  if (requestedCoupon) {
    const user = await User.findOne({ email: req.user.email }).exec();
    const { products, cartTotal } = await Cart.findOne({
      orderedBy: user._id,
    }).exec();
    const totalAfterDiscount =
      cartTotal - (cartTotal * requestedCoupon.discount) / 100;
    const productsAfterDiscount = products.map((product) => {
      return {
        ...product,
        discount: requestedCoupon.discount,
        priceAfterDiscount:
          product.price - (product.price * requestedCoupon.discount) / 100,
      };
    });
    const cartAfterDiscount = await Cart.findOneAndUpdate(
      { orderedBy: user._id },
      {
        totalAfterDiscount,
        discount: requestedCoupon.discount,
        appliedDiscount: requestedCoupon.name,
        products: productsAfterDiscount,
      },
      { new: true }
    );
    res.json(cartAfterDiscount);
  } else {
    res
      .status(400)
      .send(
        'Ce code n’a pas pu être identifié. Merci de vérifier et de réessayer.'
      );
  }
};

// @desc Remove user coupon
// @route PUT /api/users/coupon
// @access Private
const removeCoupon = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).exec();
    const { products } = await Cart.findOne({
      orderedBy: user._id,
    }).exec();
    const productsAfterRemovedDiscount = products.map((product) => {
      return {
        ...product,
        discount: null,
        priceAfterDiscount: null,
      };
    });
    const cartAfterRemovedDiscount = await Cart.findOneAndUpdate(
      { orderedBy: user._id },
      {
        totalAfterDiscount: null,
        discount: null,
        appliedDiscount: '',
        products: productsAfterRemovedDiscount,
      },
      { new: true }
    );
    res.json(cartAfterRemovedDiscount);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getUserAddress,
  applyCoupon,
  removeCoupon,
};

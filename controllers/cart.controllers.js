const Product = require('../models/product.model');
const User = require('../models/user.model');
const Cart = require('../models/cart.model');

// @desc Creating User Cart
// @route POST /api/v1/cart/
// @access Private
const createUserCart = async (req, res) => {
  const { cart } = req.body;
  const user = await User.findOne({ email: req.user.email }).exec();
  const userHasCart = await Cart.findOne({ orderedBy: user._id }).exec();

  if (userHasCart) {
    userHasCart.remove();
  }

  const updatedAndCheckedCart = await Promise.all(
    cart.map(async (product) => {
      const { productSpecifics } = await Product.findById(product?._id)
        .select('productSpecifics')
        .exec();
      if (product?.share) {
        const shareObject = productSpecifics?.filteredShares.find(
          (pShare) => pShare?.share === product?.share
        );
        return {
          ...product,
          price: Number(shareObject?.price),
        };
      } else {
        return {
          ...product,
          price: Number(productSpecifics?.price),
        };
      }
    })
  );

  const cartTotal = updatedAndCheckedCart.reduce(
    (acc, cv) => acc + Number(cv?.price) * Number(cv?.quantity),
    0
  );

  try {
    const createdCart = await new Cart({
      products: updatedAndCheckedCart,
      cartTotal,
      orderedBy: user._id,
    }).save();
    res.status(201).json(createdCart);
  } catch (error) {
    res.status(400).send(error);
  }
};

// @desc Get User Cart
// @route GET /api/v1/cart/
// @access Private
const getUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  const cart = await Cart.findOne({ orderedBy: user._id }).exec()
  res.json(cart)
};

// @desc Empty User Cart
// @route DELETE /api/v1/cart/
// @access Private
const emptyCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  const cart = await Cart.findOneAndRemove({ orderedBy: user._id }).exec()
  res.json(cart)
};

module.exports = {
  createUserCart,
  getUserCart,
  emptyCart
};

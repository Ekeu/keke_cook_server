const Product = require('../models/product.model');
const User = require('../models/user.model');
const Cart = require('../models/cart.model');
const Coupon = require('../models/coupon.model');
const stripe = require('stripe')(process.env.STRIPE_SCRETE_KEY);

// @desc Create Payment Intent
// @route POST /api/v1/stripe/create-payment-intent
// @access Private
const createPaymentIntent = async (req, res) => {
  try {
    let stripeFinalAmountToPay = 0;
    const user = await User.findOne({ email: req.user.email }).exec();
    const { cartTotal, appliedDiscount, discount, totalAfterDiscount } =
      await Cart.findOne({ orderedBy: user._id }).exec();

    if (appliedDiscount && discount && totalAfterDiscount) {
      console.log('Discount')
      stripeFinalAmountToPay = Number(totalAfterDiscount);
    } else {
      stripeFinalAmountToPay = Number(cartTotal);
    }
        
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.ceil(stripeFinalAmountToPay * 100),
      currency: 'eur',
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  createPaymentIntent,
};

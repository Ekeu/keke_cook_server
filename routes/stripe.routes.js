const express = require('express');
const router = express.Router();

const { createPaymentIntent } = require('../controllers/stripe.controllers');

const { authCheck } = require('../middlewares/auth.middleware');

router.route('/create-payment-intent').post(authCheck, createPaymentIntent);

module.exports = router;

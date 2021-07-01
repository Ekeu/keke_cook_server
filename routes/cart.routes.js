const express = require('express');
const router = express.Router();

const {
  createUserCart,
  getUserCart,
  emptyCart
} = require('../controllers/cart.controllers');

const { authCheck } = require('../middlewares/auth.middleware');

router
  .route('/')
  .get(authCheck, getUserCart)
  .post(authCheck, createUserCart)
  .delete(authCheck, emptyCart);

module.exports = router;

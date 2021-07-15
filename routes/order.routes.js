const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
} = require('../controllers/order.controllers');
const { authCheck, adminCheck } = require('../middlewares/auth.middleware');

router.route('/').post( authCheck, createOrder).get( authCheck, adminCheck, getOrders);
router.route('/me').get( authCheck, getMyOrders);
router.route('/:_id').get( authCheck, getOrderById);
router.route('/:_id/pay').put( authCheck, updateOrderToPaid);
router.route('/:_id/deliver').put( authCheck, adminCheck, updateOrderToDelivered);

module.exports = router;

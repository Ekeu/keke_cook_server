const express = require('express');
const router = express.Router();

const {
  getAllOrders,
  updateUserOrderStatus,
} = require('../controllers/admin.controllers');

const { authCheck, adminCheck } = require('../middlewares/auth.middleware');

router.route('/orders').get(authCheck, adminCheck, getAllOrders);
router.route('/orders/:_id').put(authCheck, adminCheck, updateUserOrderStatus);;

module.exports = router;

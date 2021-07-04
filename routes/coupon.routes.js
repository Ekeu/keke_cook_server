const express = require('express');
const router = express.Router();
const {
  getCoupons,
  deleteCoupon,
  createCoupon,
} = require('../controllers/coupon.controllers');
const { authCheck, adminCheck } = require('../middlewares/auth.middleware');

router.route('/').get(getCoupons).post(authCheck, adminCheck, createCoupon);
router.route('/:_id').delete(authCheck, adminCheck, deleteCoupon);

module.exports = router;

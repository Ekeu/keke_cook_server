const express = require('express');
const router = express.Router();

const {
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getUserAddress,
  applyCoupon,
  removeCoupon,
  getAllProductsInWishlist,
  addProductToWishlist,
  removeProductFromWishlist
} = require('../controllers/user.controllers');

const { authCheck } = require('../middlewares/auth.middleware');

router.route('/coupon').post(authCheck, applyCoupon).put(authCheck, removeCoupon);
router.route('/address/add').post(authCheck, addUserAddress);
router.route('/address/delete/:_id').delete(authCheck, deleteUserAddress);
router.route('/address/update/:_id').put(authCheck, updateUserAddress);
router.route('/address/:_id').get(authCheck, getUserAddress);
router.route('/wishlist').get(authCheck, getAllProductsInWishlist).post(authCheck, addProductToWishlist);
router.route('/wishlist/:_id').put(authCheck, removeProductFromWishlist);

module.exports = router;

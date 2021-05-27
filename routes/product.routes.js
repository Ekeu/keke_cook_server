const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductBySlug,
  deleteProduct,
  createProduct,
  updateProduct,
} = require('../controllers/product.controllers');
const { authCheck, adminCheck } = require('../middlewares/auth.middleware');

router.route('/').get(getProducts).post(authCheck, adminCheck, createProduct);
router
  .route('/:slug')
  .get(getProductBySlug)
  .delete(authCheck, adminCheck, deleteProduct)
  .put(authCheck, adminCheck, updateProduct);

module.exports = router;

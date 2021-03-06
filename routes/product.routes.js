const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductBySlug,
  deleteProduct,
  createProduct,
  updateProduct,
  getSortedProducts,
  createProductReview,
  getRelatedProducts
} = require('../controllers/product.controllers');
const { authCheck, adminCheck } = require('../middlewares/auth.middleware');

router.route('/').get(getProducts).post(authCheck, adminCheck, createProduct);
router.route('/filter').get(getSortedProducts);
router
  .route('/:slug')
  .get(getProductBySlug)
  .delete(authCheck, adminCheck, deleteProduct)
  .put(authCheck, adminCheck, updateProduct);
router.put('/:_id/reviews', authCheck, createProductReview)
router.get('/:_id/related', getRelatedProducts)

module.exports = router;

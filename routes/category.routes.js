const express = require('express');
const router = express.Router();

const {
  getCategoryBySlug,
  getCategories,
  deleteCategory,
  createCategory,
  updateCategory,
  getSubcategoriesFromCategory
} = require('../controllers/category.controllers');

const { authCheck, adminCheck } = require('../middlewares/auth.middleware');

router
  .route('/')
  .get(getCategories)
  .post(authCheck, adminCheck, createCategory);
router
  .route('/:slug')
  .get(getCategoryBySlug)
  .delete(authCheck, adminCheck, deleteCategory)
  .put(authCheck, adminCheck, updateCategory);
router.route('/subcategories/:_id').get(getSubcategoriesFromCategory)

module.exports = router;

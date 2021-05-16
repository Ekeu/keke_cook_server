const express = require('express');
const router = express.Router();

const {
  getSubcategoryBySlug,
  getSubcategories,
  deleteSubcategory,
  createSubcategory,
  updateSubcategory,
} = require('../controllers/subcategory.controllers');

const { authCheck, adminCheck } = require('../middlewares/auth.middleware');

router
  .route('/')
  .get(getSubcategories)
  .post(authCheck, adminCheck, createSubcategory);
router
  .route('/:slug')
  .get(getSubcategoryBySlug)
  .delete(authCheck, adminCheck, deleteSubcategory)
  .put(authCheck, adminCheck, updateSubcategory);

module.exports = router;

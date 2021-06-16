const Category = require('../models/category.model');
const Product = require('../models/product.model');
const Subcategory = require('../models/subcategory.model');

const slugify = require('slugify');
const initials = require('initials');

// @desc Fetch single category with it's products
// @route GET /api/v1/categories/:slug
// @access Public
const getCategoryBySlug = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug }).exec();
  const products = await Product.find({ category }).populate('category').exec();
  res.json({ category, products });
};

// @desc Fetch all categories
// @route GET /api/v1/categories/
// @access Public
const getCategories = async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: -1 }).exec();
  res.json(categories);
};

// @desc Fetch all subcategories from category
// @route GET /api/v1/categories/subcategories/:_id
// @access Public
const getSubcategoriesFromCategory = async (req, res) => {
  Subcategory.find({ parentCategory: req.params._id }).exec(
    (error, subcategories) => {
      if (error) {
        res.json(error);
      } else {
        res.json(subcategories);
      }
    }
  );
};

// @desc Delete category
// @route DELETE /api/v1/categories/:slug
// @access Private/admin
const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findOneAndDelete({
      slug: req.params.slug,
    });
    deletedCategory.RemoveFromAlgolia();
    res.json(deletedCategory);
  } catch (error) {
    res.status(400).send('La suppression de cette catégorie à échouée');
  }
};

// @desc Create category
// @route POST /api/v1/categories/
// @access Private/admin
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Category({
      name,
      slug: slugify(name, { lower: true }),
      initials: initials(name),
    }).save();
    res.json(category);
  } catch (error) {
    res.status(400).send('La création de cette catégorie à échouée');
  }
};

// @desc Update Category
// @route PUT  /api/v1/categories/:slug
// @access Private/admin
const updateCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const updatedCategory = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name, { lower: true }), initials: initials(name) },
      { new: true }
    );
    updatedCategory.SyncToAlgolia();
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).send('La mises à jour de cette catégorie à échouée');
  }
};

module.exports = {
  getCategoryBySlug,
  getSubcategoriesFromCategory,
  getCategories,
  deleteCategory,
  createCategory,
  updateCategory,
};

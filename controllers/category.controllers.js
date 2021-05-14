const Category = require('../models/category.model');
const slugify = require('slugify');
const initials = require('initials');

// @desc Fetch single category
// @route GET /api/v1/categories/:slug
// @access Public
const getCategoryBySlug = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug }).exec();
  res.json(category);
};

// @desc Fetch all categories
// @route GET /api/v1/categories/
// @access Public
const getCategories = async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: -1 }).exec();
  res.json(categories);
};

// @desc Delete category
// @route DELETE /api/v1/categories/:slug
// @access Private/admin
const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findOneAndDelete({
      slug: req.params.slug,
    });
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
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).send('La mises à jour de cette catégorie à échouée');
  }
};

module.exports = {
  getCategoryBySlug,
  getCategories,
  deleteCategory,
  createCategory,
  updateCategory,
};

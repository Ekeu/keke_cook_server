const Subcategory = require('../models/subcategory.model');
const Product = require('../models/product.model');
const slugify = require('slugify');
const initials = require('initials');

// @desc Fetch single category
// @route GET /api/v1/categories/:slug
// @access Public
const getSubcategoryBySlug = async (req, res) => {
  const subcategory = await Subcategory.findOne({
    slug: req.params.slug,
  })
    .populate('parentCategory')
    .exec();
  const products = await Product.find({ subcategories: subcategory })
    .populate('category')
    .exec();
  res.status(201).json({subcategory, products});
};

// @desc Fetch all subcategories
// @route GET /api/v1/subcategories/
// @access Public
const getSubcategories = async (req, res) => {
  const subcategories = await Subcategory.find({})
    .populate('parentCategory')
    .sort({ createdAt: -1 })
    .exec();
  const groupedSubcategories = subcategories.reduce((acc, obj) => {
    const key = obj.parentCategory['name'];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
  const groupedSubcategoriesInArray = [];
  for (const prop in groupedSubcategories) {
    groupedSubcategoriesInArray.push({
      category: prop,
      subcategories: groupedSubcategories[prop],
    });
  }
  res.json(groupedSubcategoriesInArray);
};

// @desc Delete category
// @route DELETE /api/v1/categories/:slug
// @access Private/admin
const deleteSubcategory = async (req, res) => {
  try {
    const deletedSubcategory = await Subcategory.findOneAndDelete({
      slug: req.params.slug,
    });
    deletedSubcategory.RemoveFromAlgolia()
    res.json(deletedSubcategory);
  } catch (error) {
    res.status(400).send('La suppression de cette sous catégorie à échouée');
  }
};

// @desc Create subcategory
// @route POST /api/v1/subcategories/
// @access Private/admin
const createSubcategory = async (req, res) => {
  try {
    const { name, parentCategory } = req.body;
    const subcategory = await new Subcategory({
      name,
      slug: slugify(name, { lower: true }),
      initials: initials(name),
      parentCategory,
    }).save();
    res.json(subcategory);
  } catch (error) {
    res.status(400).send('La création de cette sous catégorie à échouée');
  }
};

// @desc Update Category
// @route PUT  /api/v1/categories/:slug
// @access Private/admin
const updateSubcategory = async (req, res) => {
  const { name, parentCategory } = req.body;
  try {
    const updatedSubcategory = await Subcategory.findOneAndUpdate(
      { slug: req.params.slug },
      {
        name,
        slug: slugify(name, { lower: true }),
        initials: initials(name),
        parentCategory,
      },
      { new: true }
    );
    updatedSubcategory.SyncToAlgolia()
    res.json(updatedSubcategory);
  } catch (error) {
    res.status(400).send('La mises à jour de cette sous catégorie à échouée');
  }
};

module.exports = {
  getSubcategoryBySlug,
  getSubcategories,
  deleteSubcategory,
  createSubcategory,
  updateSubcategory,
};

const Product = require('../models/product.model');
const slugify = require('slugify');

// @desc Fetch all products
// @route GET /api/v1/products
// @access Public
const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products)
};

// @desc Fetch single food
// @route GET /api/foods/:_id
// @access Public
const getProductById = async (req, res) => {};

// @desc Delete food
// @route DELETE /api/foods/:_id
// @access Private/admin
const deleteProduct = async (req, res) => {};

// @desc Create Product
// @route POST /api/v1/products
// @access Private/admin
const createProduct = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.title, { lower: true });
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.log(error)
    res
      .status(400)
      .send('La création du produit à échouée. Veuillez réessayer');
  }
};

// @desc Update Product
// @route PUT /api/foods/:_id
// @access Private/admin
const updateProduct = async (req, res) => {};

// @desc New Review
// @route POST /api/foods/:_id/reviews
// @access Private
const createProductReview = async (req, res) => {};

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  createProductReview,
  updateProduct,
};

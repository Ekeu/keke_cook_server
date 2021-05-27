const Product = require('../models/product.model');
const slugify = require('slugify');

// @desc Fetch all products
// @route GET /api/v1/products
// @access Public
const getProducts = async (req, res) => {
  const products = await Product.find({})
    .limit(Number(req.query.size))
    .populate('category')
    .populate('subcategories')
    .sort([['createdAt', 'desc']])
    .exec();
  res.json(products);
};

// @desc Fetch single food
// @route GET /api/v1/products/:slug
// @access Public
const getProductBySlug = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate('category')
    .populate('subcategories')
    .exec();

  if (product) {
    res.json(product);
  } else {
    res.status(404).send("Ce produit n'existe pas");
  }
};

// @desc Delete food
// @route DELETE /api/v1/products/:slug
// @access Private/admin
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.json(deletedProduct);
  } catch (error) {
    res.status(404).send(error);
  }
};

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
    console.log(error);
    res
      .status(400)
      .send('La création du produit à échouée. Veuillez réessayer');
  }
};

// @desc Update Product
// @route PUT /api/v1/products/:slug
// @access Private/admin
const updateProduct = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title, { lower: true });
    }
    const updatedProduct = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).send('La mises à jour de ce produit à échouée');
  }
};

// @desc New Review
// @route POST /api/foods/:_id/reviews
// @access Private
const createProductReview = async (req, res) => {};

module.exports = {
  getProducts,
  getProductBySlug,
  deleteProduct,
  createProduct,
  createProductReview,
  updateProduct,
};

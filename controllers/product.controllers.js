const Product = require('../models/product.model');
const User = require('../models/user.model');
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
    deletedProduct.RemoveFromAlgolia()
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
    updatedProduct.SyncToAlgolia()
    res.json(updatedProduct);
  } catch (error) {
    console.log(error)
    res.status(400).send('La mises à jour de ce produit à échouée');
  }
};

// @desc New Review (Star Rating)
// @route PUT /api/v1/products/:_id/reviews
// @access Private
const createProductReview = async (req, res) => {
  const product = await Product.findById(req.params._id).exec();
  const user = await User.findOne({ email: req.user.email }).exec();

  const { rating } = req.body;

  const alreadyReviewed = product.ratings.find(
    (review) => review.user.toString() === user._id.toString()
  );

  try {
    if (alreadyReviewed) {
      const updatedRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyReviewed },
        },
        { $set: { 'ratings.$.rating': rating } },
        { new: true }
      ).exec();
      updatedRating.SyncToAlgolia()
      res.status(201).json(updatedRating);
    } else {
      const addedRating = await Product.findByIdAndUpdate(
        product._id,
        {
          $push: { ratings: { rating, user: user._id } },
        },
        { new: true }
      ).exec();
      addedRating.SyncToAlgolia()
      res.status(201).json(addedRating);
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

// Without Pagination
/* // @desc Get sortproducts
// @route Get /api/v1/products/sort
// @access Public
const getSortedProducts = async (req, res) => {
  try {
    const { sort, order, limit } = req.query;
    const products = await Product.find({})
      .populate('category')
      .populate('subcategories')
      .sort([[sort, order]])
      .limit(Number(limit))
      .exec();
    res.json(products);
  } catch (error) {
    console.log(error)
    res.status(401).json(error);
  }
}; */

// @desc Get sortproducts
// @route Get /api/v1/products/sort
// @access Public
const getSortedProducts = async (req, res) => {
  try {
    const { sort, order, pageNumber } = req.query;
    const page = Number(pageNumber) || 1;
    const pageSize = 3;

    const count = await Product.find({}).estimatedDocumentCount().exec();
    const products = await Product.find({})
      .skip(pageSize * (page - 1))
      .populate('category')
      .populate('subcategories')
      .sort([[sort, order]])
      .limit(pageSize)
      .exec();
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json(error);
  }
};

// @desc Get Related Products
// @route Get /api/v1/products/:_id/related
// @access Public
const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params._id).exec();
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    })
      .limit(3)
      .populate('category')
      .populate('subcategories')
      .populate('user');
    res.json(relatedProducts);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  deleteProduct,
  createProduct,
  createProductReview,
  updateProduct,
  getSortedProducts,
  getRelatedProducts,
};

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { ObjectId } = mongoose.Schema;
const mongooseAlgolia = require('mongoose-algolia');

const { averageRating } = require('../utils/functions');

dotenv.config();

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      text: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 4000,
      text: true,
    },
    price: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    range_price: {
      type: Number,
      default: 0,
      required: true,
    },
    category: {
      type: ObjectId,
      ref: 'Category',
    },
    subcategories: [
      {
        type: ObjectId,
        ref: 'Subcategory',
      },
    ],
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    shipping: {
      type: String,
      enum: ['Oui', 'Non'],
    },
    color: {
      type: String,
    },
    productType: {
      type: String,
    },
    ratings: [
      {
        rating: Number,
        user: {
          type: ObjectId,
          required: true,
          ref: 'User',
        },
      },
    ],
    productSpecifics: Object,
  },
  {
    timestamps: true,
  }
);

productSchema.plugin(mongooseAlgolia, {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_ADMIN_API_KEY,
  indexName: process.env.ALGOLIA_PRODUCTS_INDEX_NAME,
  populate: {
    path: 'category subcategories',
  },
  virtuals: {
    rating: function(doc) {
      return averageRating(doc.ratings)
    }
  }
});

const Product = mongoose.model('Product', productSchema);

Product.SyncToAlgolia();
Product.SetAlgoliaSettings({
  searchableAttributes: [
    'title',
    'description',
    'price',
    'productType',
    'color',
    'subcategories.name',
    'category',
  ],
  attributesForFaceting: [
    'color',
    'price',
    'category',
    'subcategories.name',
    'shipping',
    'range_price',
    'productType',
    'ratings.rating',
    'productSpecifics.shares.share.name',
    'productSpecifics.cakes.name',
    'productSpecifics.fodders.name',
    'productSpecifics.creamColors.name',
    'productSpecifics.toppings.name',
  ],
  customRanking: ['desc(sold)', 'desc(rating)'],
  replicas: ['keke-products-price-asc', 'keke-products-price-desc'],
});

module.exports = Product;

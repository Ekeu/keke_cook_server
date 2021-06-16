const mongoose = require('mongoose');
const mongooseAlgolia = require('mongoose-algolia');
const dotenv = require('dotenv');
const { ObjectId } = mongoose.Schema;

dotenv.config();

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Trop court'],
      maxlength: [32, 'Trop long'],
    },
    initials: {
      type: String,
      required: true,
      uppercase: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    parentCategory: {
      type: ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

subcategorySchema.plugin(mongooseAlgolia, {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_ADMIN_API_KEY,
  indexName: process.env.ALGOLIA_SUBCATEGORY_INDEX_NAME,
  populate: {
    path: 'parentCategory',
  },
});

const Subcategory = mongoose.model('Subcategory', subcategorySchema);

Subcategory.SyncToAlgolia();
Subcategory.SetAlgoliaSettings({
  searchableAttributes: ['name', 'initials'],
});

module.exports = Subcategory;

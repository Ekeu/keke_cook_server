const mongoose = require('mongoose');
const mongooseAlgolia = require('mongoose-algolia');
const dotenv = require('dotenv');

const { ObjectId } = mongoose.Schema;

dotenv.config();

const categorySchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

categorySchema.plugin(mongooseAlgolia, {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_ADMIN_API_KEY,
  indexName: process.env.ALGOLIA_CATEGORY_INDEX_NAME,
});

const Category = mongoose.model('Category', categorySchema);

Category.SyncToAlgolia();
Category.SetAlgoliaSettings({
  searchableAttributes: ['name', 'initials'],
});

module.exports = Category;

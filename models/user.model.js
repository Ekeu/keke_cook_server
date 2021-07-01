const mongoose = require('mongoose');
const mongooseAlgolia = require('mongoose-algolia');
const dotenv = require('dotenv');
const { ObjectId } = mongoose.Schema;

dotenv.config();

const userSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    photoURL: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'subscriber',
    },
    cart: {
      type: Array,
      default: [],
    },
    addresses: {
      type: Array,
      default: [],
    },
    /* wishlist: [
      {
        type: ObjectId,
        ref: 'Product',
      },
    ], */
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(mongooseAlgolia, {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_ADMIN_API_KEY,
  indexName: process.env.ALGOLIA_USERS_INDEX_NAME,
  populate: {
    path: 'wishlist',
  }
});

const User = mongoose.model('User', userSchema);

User.SyncToAlgolia();
User.SetAlgoliaSettings({
  searchableAttributes: [
    'displayName',
    'email',
    'addresses'
  ]
});

module.exports = User;

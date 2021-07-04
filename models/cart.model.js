const mongoose = require('mongoose');
const mongooseAlgolia = require('mongoose-algolia');
const dotenv = require('dotenv');

const { ObjectId } = mongoose.Schema;

dotenv.config();

const cartSchema = new mongoose.Schema(
  {
    products: Array,
    cartTotal: Number,
    discount: Number,
    appliedDiscount: String,
    totalAfterDiscount: Number,
    orderedBy: {
      type: ObjectId,
      ref: 'User',
    },
    requestedDate: Date,
  },
  {
    timestamps: true,
  }
);

cartSchema.plugin(mongooseAlgolia, {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_ADMIN_API_KEY,
  indexName: process.env.ALGOLIA_CARTS_INDEX_NAME,
});

const Cart = mongoose.model('Cart', cartSchema);

Cart.SyncToAlgolia();

module.exports = Cart;

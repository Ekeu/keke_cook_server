const mongoose = require('mongoose');
const mongooseAlgolia = require('mongoose-algolia');
const dotenv = require('dotenv');

const { ObjectId } = mongoose.Schema;

dotenv.config();

const orderSchema = new mongoose.Schema(
  {
    products: Array,
    paymentIntent: {},
    address: {},
    orderStatus: {
        type: String,
        default: 'Non traitée',
        enum: [
            'Non traitée',
            'Pris en charge',
            'Expédiée',
            'Annulée',
            'Traitée'
        ]
    },
    requestedDate: Date,
    orderedBy: {
      type: ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.plugin(mongooseAlgolia, {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_ADMIN_API_KEY,
  indexName: process.env.ALGOLIA_ORDERS_INDEX_NAME,
});

const Order = mongoose.model('Order', orderSchema);

Order.SyncToAlgolia();

module.exports = Order;

const mongoose = require('mongoose');
const mongooseAlgolia = require('mongoose-algolia');
const dotenv = require('dotenv');

dotenv.config();

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      uppercase: true,
      required: 'Name is required',
      minlength: [6, 'Too Short'],
      maxlength: [12, 'Too Long'],
    },
    expiry: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

couponSchema.plugin(mongooseAlgolia, {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_ADMIN_API_KEY,
  indexName: process.env.ALGOLIA_COUPONS_INDEX_NAME,
});

const Coupon = mongoose.model('Coupon', couponSchema);

Coupon.SyncToAlgolia();
Coupon.SetAlgoliaSettings({
  searchableAttributes: ['name', 'expiry'],
});

module.exports = Coupon;

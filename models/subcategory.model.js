const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

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

const Subcategory = mongoose.model('Subcategory', subcategorySchema);

module.exports = Subcategory;

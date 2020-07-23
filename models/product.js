const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productRules = {
  name: {
    required: true,
    type: String,
    trim: true,
    maxLength: 32,
  },
  description: {
    required: true,
    type: String,
    maxLength: 2000,
  },
  price: {
    required: true,
    type: Number,
    maxLength: 32,
  },
  category: {
    required: true,
    type: ObjectId,
    ref: "Category",
  },
  quantity: {
    required: true,
    type: Number,
  },
  soldQuantity: {
    type: Number,
    default: 0,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  shipping: {
    required: true,
    type: Boolean,
  },
};

const productSchema = new mongoose.Schema(productRules, {
  timestamps: true,
});

module.exports = mongoose.model("Product", productSchema);

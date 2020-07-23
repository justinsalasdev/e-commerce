const mongoose = require("mongoose");

const categoryRules = {
  name: {
    type: String,
    trim: true,
    required: true,
    maxLength: 32,
  },
};

const categorySchema = new mongoose.Schema(categoryRules, {
  timestamps: true,
});

module.exports = mongoose.model("Category", categorySchema);

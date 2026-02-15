const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    // Parent Category reference (eg: electronics)
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    // Subcategory name (eg: Thar, Scorpio, BMW)
    subcat_name: {
      type: String,
      required: true,
      trim: true,
    },

    // Images (single or multiple)
    images: {
      type: [String], // always array
      default: [],
    },

    // Optional remark / note
    remark: {
      type: String,
      trim: true,
    },

    // Status
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model("SubCategory", subCategorySchema);

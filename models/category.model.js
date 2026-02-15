const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    cat_name: {
      type: String
    },
    cat_images: {
      type: [String],
      default:[],
    },
     is_active: {
      type: Boolean,
      default: true,
    },
    remark: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);

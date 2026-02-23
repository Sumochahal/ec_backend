const Product = require("../../models/product.model");

exports.getProductwithname = async (req, res) => {
  try {
    const products = await Product.find({ is_active: true })
      .populate("category_id", "name")
      .populate("subcategory_id", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: products.length,
      data: products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
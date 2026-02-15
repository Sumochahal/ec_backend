const Category = require("../../models/category.model");

// GET USER CATEGORIES (ID + NAME only)
exports.getUserCategories = async (req, res) => {
  try {
    const categories = await Category.find(
      { is_active: true }          // only active
    ).select("_id cat_name");      // only id & name

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};

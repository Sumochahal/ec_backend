const SubCategory = require("../../models/subcategory.model");
const Category = require("../../models/category.model");
const fs = require("fs");
const path = require("path");
exports.createSubCategory = async (req, res) => {
  try {
    const { category_id, subcat_name, remark } = req.body;

    // 1️Validate Category
    const category = await Category.findById(category_id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 2️Collect images (single OR multiple)
    const images = req.files ? req.files.map(file => file.path) : [];

    // 3️Create SubCategory
    const subCategory = await SubCategory.create({
      category_id,
      subcat_name,
      remark,
      images,
    });

    res.status(201).json({
      success: true,
      message: "SubCategory created successfully",
      data: subCategory,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// subcategory get by id 
exports.getSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const subCategory = await SubCategory.findById(id)
      .populate("category_id", "name is_active"); // sirf required fields

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }

    res.status(200).json({
      success: true,
      data: subCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// for getall subcategory.....
exports.getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subCategories.length,
      data: subCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// delete by id subcaterogy

exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const subCategory = await SubCategory.findById(id);

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }//Delete images from storage
    if (subCategory.images && subCategory.images.length > 0) {
      subCategory.images.forEach((imgPath) => {
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      });
    }

    await SubCategory.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "SubCategory deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// update subcaterogy....
exports.updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { subcat_name, remark, is_active } = req.body;

    const subCategory = await SubCategory.findById(id);

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }

    //Update text fields
    if (subcat_name) subCategory.subcat_name = subcat_name;
    if (remark) subCategory.remark = remark;
    if (is_active !== undefined) subCategory.is_active = is_active;

    // REPLACE images
    if (req.files && req.files.length > 0) {

      // 1️delete old images
      if (subCategory.images && subCategory.images.length > 0) {
        subCategory.images.forEach((imgPath) => {
          if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath);
          }
        });
      }

      // 2save new images
      subCategory.images = req.files.map(file => file.path);
    }

    await subCategory.save();

    res.status(200).json({
      success: true,
      message: "SubCategory updated successfully",
      data: subCategory,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

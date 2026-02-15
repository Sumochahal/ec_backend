const Category = require("../../models/category.model");
const fs = require("fs");
const path = require("path");

// CREATE
exports.createCategory = async (req, res) => {
  try {
    const { cat_name, is_active,remark } = req.body;

    const images = req.files
      ? req.files.map((file) => file.filename)
      : [];

    const category = await Category.create({
      cat_name,
      cat_images: images,
      remark,
    });

    res.status(201).json({ msg: "Category created", category });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// READ ALL
exports.getCategories = async (req, res) => {
  try {
    const data = await Category.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// READ ONE
exports.getCategory = async (req, res) => {
  try {
    const data = await Category.findById(req.params.id);
    if (!data) return res.status(404).json({ msg: "Category not found" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// UPDATE
exports.updateCategory = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      updateData.cat_images = req.files.map((file) => file.filename);
    }

    const data = await Category.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!data) return res.status(404).json({ msg: "Category not found" });

    res.json({ msg: "Updated", data });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// DELETE
exports.deleteCategory = async (req, res) => {
  try {
    const data = await Category.findByIdAndDelete(req.params.id);

    if (!data) return res.status(404).json({ msg: "Category not found" });

    // delete images
    data.cat_images.forEach((img) => {
      const imgPath = path.join("uploads", img);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    });

    res.json({ msg: "Deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

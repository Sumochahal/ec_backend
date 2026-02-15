const express = require("express");
const router = express.Router();
const upload = require("../../config/multer");

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../../controllers/admin/category.admin.controller");

// 🔹 middleware to set upload folder
const categoryUploadFolder = (req, res, next) => {
  req.uploadFolder = "categories";
  next();
};

// multiple images
router.post("/create", upload.array("cat_images", 10), createCategory);

router.get("/", getCategories);

router.get("/:id", getCategory);

// update with images
router.put("/:id", upload.array("cat_images", 10), updateCategory);

router.delete("/:id", deleteCategory);

module.exports = router;

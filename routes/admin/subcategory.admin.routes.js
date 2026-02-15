const express = require("express");
const router = express.Router();
const upload = require("../../config/multer");

const {
  createSubCategory,
  getSubCategoryById,
  getAllSubCategories,
  deleteSubCategory,
  updateSubCategory,
} = require("../../controllers/admin/subcategory.admin.controller");

// set upload folder
const subCategoryUploadFolder = (req, res, next) => {
  req.uploadFolder = "categories/subcategories";
  next();
};

// CREATE SubCategory route(image optional, single or multiple)
router.post(
  "/create",
  subCategoryUploadFolder,
  upload.array("images", 5), // max 5 images
  createSubCategory
);
router.get("/:id", getSubCategoryById);
router.get("/", getAllSubCategories);
router.delete("/:id",deleteSubCategory);
// UPDATE SubCategory
router.put(
  "/:id",
  subCategoryUploadFolder,
  upload.array("images", 5),
  updateSubCategory
);
module.exports = router;

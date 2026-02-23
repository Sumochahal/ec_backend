const express = require("express");
const router = express.Router();
const upload = require("../../config/multer");

const {
  createProduct,
  getSingleProduct,
  getallProduct,
  // getProductwithname,
  deleteProduct,
  updateProduct,
} = require("../../controllers/admin/product.admin.controller");

// upload folder middleware
const productUploadFolder = (req, res, next) => {
  req.uploadFolder = "products";
  console.log("UPLOAD FOLDER:", req.uploadFolder);
  next();
};

// CREATE PRODUCT
router.post("/create/:category_id",productUploadFolder,
  upload.array("images", 5), // max 5 images
  createProduct
);
// router.get("/search", getProductwithname);// for catid with name and same subcatid with name

router.get("/:id", getSingleProduct); // for get single product by id 
router.get("/", getallProduct);

router.delete("/:id",deleteProduct);
router.put("/:id",productUploadFolder,upload.array("images", 5),updateProduct);

module.exports = router;
